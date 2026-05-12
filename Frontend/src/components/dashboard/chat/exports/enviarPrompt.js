import api from '../../../../api/axios';
import { supabase } from '../../../../supabaseClient';

export const enviarPrompt = async (prompt, conversationId, location, signal, onChunk) => {
  // Obtener token de Supabase
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  if (!token) {
    throw new Error('No hay sesión de autenticación');
  }

  // La URL base ya apunta al backend en Railway.
  const baseURL = api.defaults.baseURL || '/api';
  const normalizedBaseURL = baseURL.replace(/\/$/, '');
  const url = `${normalizedBaseURL}/ai/mandandoAlaIA`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      prompt,
      conversationId,
      location
    }),
    signal
  });

  if (!response.ok) {
    throw new Error(`Error en la respuesta: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';
  let metadata = null;
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Guardar línea incompleta

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          try {
            const event = JSON.parse(jsonStr);
            
            if (event.type === 'metadata') {
              metadata = event;
            } else if (event.type === 'chunk') {
              fullResponse += event.content;
              onChunk?.(event.content, fullResponse);
            } else if (event.type === 'done') {
              // Stream completado
              break;
            } else if (event.type === 'error') {
              throw new Error(event.error);
            }
          } catch (e) {
            console.error('Error parseando SSE:', e);
          }
        }
      }
    }

    // Procesar buffer final
    if (buffer.startsWith('data: ')) {
      const jsonStr = buffer.slice(6);
      try {
        const event = JSON.parse(jsonStr);
        if (event.type === 'chunk') {
          fullResponse += event.content;
          onChunk?.(event.content, fullResponse);
        }
      } catch (e) {
        console.error('Error parseando SSE final:', e);
      }
    }

    return {
      text: fullResponse,
      ...metadata
    };
  } catch (error) {
    throw error;
  }
};
