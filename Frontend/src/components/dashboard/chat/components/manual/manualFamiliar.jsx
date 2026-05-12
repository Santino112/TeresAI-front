import React from 'react';
import { useState } from 'react';
import { Typography, Button, TextField, Box, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import ElderlyRoundedIcon from "@mui/icons-material/ElderlyRounded";

const steps = [
    {
        id: 'panel1',
        icon: <HelpOutlineRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: "¿Qué puede hacer Teresa?",
        description: (
            <Box sx={{ color: '#000000' }}>
                <Typography variant='body1' sx={{ lineHeight: 1.6, mb: 2 }}>
                    Teresa opera como una <strong>interfaz de monitoreo inteligente</strong> que centraliza la actividad diaria del adulto mayor para facilitar la gestión del familiar a cargo. Su funcionamiento se basa en el análisis técnico de tres ejes estratégicos:
                </Typography>

                <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 2 } }}>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>1. Procesamiento de Datos del Usuario:</strong> Teresa recolecta y procesa continuamente la información de las interacciones, permitiendo la identificación de patrones, registro de incidentes y optimización del perfil asistencial.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>2. Gestión Operativa:</strong> Como cuidadora profesional, transforma la información en acciones concretas (control de agenda médica, gestión de suministros y reportes de estado) para reducir la carga administrativa del entorno familiar.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>3. Asistencia Preventiva 24/7:</strong> Disponibilidad técnica absoluta para mantener la estabilidad del entorno, garantizando intervención inmediata ante dudas operativas o cuadros de desorientación.
                        </Typography>
                    </li>
                </Box>
            </Box>
        )
    },
    {
        id: 'panel2',
        icon: <ErrorOutlineRoundedIcon sx={{ mr: 2, color: '#d32f2f' }} />,
        label: 'Emergencias',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                En caso de <strong>emergencia</strong>, Teresa puede notificar de inmediato a tu familiar o cuidador vinculado. Con solo pedírselo, ellos recibirán un aviso para estar al tanto de lo que sucede al instante.
            </Typography>
        )
    },
    {
        id: 'panel3',
        icon: <ChatBubbleOutlineRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Hablar con Teresa',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                Para hablar con Teresa, utiliza el campo de texto centrado en pantalla. Aquí puedes escribir consultas, números o cualquier información.
                <br /><br />
                Debajo del campo de texto encontrarás tres herramientas principales:
                <br /><br />
                • El botón <strong>enviar</strong> <ArrowUpwardRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> aparecerá al escribir y sirve para procesar tu mensaje.
                <br />
                • Si prefieres usar tu voz, mantén presionado el botón de <strong>audio</strong> <MicOffRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> y suéltalo al terminar de hablar.
                Recuerda tener activado tu micrófono en tu dispositivo móvil o en tu navegador de preferencia para que esta función funcione correctamente.
                <br />
                • A la izquierda, el botón de <strong>voz</strong> <VolumeOffRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> permitirá que la IA lea sus respuestas en voz alta.
            </Typography>
        )
    },
    {
        id: 'panel4',
        icon: <SearchRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Búsqueda de conversaciones',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                Para buscar las conversaciones que tuviste con teresa, haz clic en <strong><SearchRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> Buscar conversaciones</strong> ubicado en el panel lateral izquierdo de la pantalla. <br></br>
                Al hacer clic, se abrirá un campo de búsqueda donde podrás escribir palabras clave o frases para encontrar conversaciones específicas. En el cuadrante grande se mostrará los resultados relacionados con tu búsqueda, facilitando el acceso a información importante que hayas compartido en el pasado. <br></br>
                Luego, podrás hacer clic sobre alguno de estos resultados y la aplicación te llevará directamente a esa conversación, permitiéndote revisar el contexto completo y continuar la interacción que tuviste con teresa previamente.
            </Typography>
        )
    },
    {
        id: "pánel5",
        icon: <ElderlyRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: "Control de tu familiar",
        description: (
            <Box sx={{ color: '#000000' }}>
                <Typography variant='body1' sx={{ lineHeight: 1.6, mb: 2 }}>
                    Esta interfaz proporciona una <strong>auditoría analítica</strong> sobre el bienestar y la actividad del adulto mayor. A través de indicadores visuales avanzados, usted puede supervisar la evolución del servicio y el estado biopsicosocial del usuario de manera cuantitativa.
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 2 } }}>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Análisis de Actividad y Uso:</strong> Reportes gráficos (barras y sectores) que desglosan el tiempo de interacción con Teresa. Permite monitorear la adherencia al sistema con comparativas semanales, mensuales y anuales.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Indicadores de Bienestar Emocional:</strong> Basándose en el análisis del lenguaje y el tono de las interacciones, el sistema genera métricas sobre el nivel de satisfacción y estabilidad emocional (Nivel de Felicidad) del usuario.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Detección de Tendencias:</strong> La visualización de datos facilita la identificación temprana de cambios en la rutina o en el estado de ánimo, funcionando como una herramienta de diagnóstico preventivo para el entorno familiar.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Resumen Ejecutivo de Gestión:</strong> Un tablero de control rápido diseñado para ofrecer una visión global del estado del adulto mayor en menos de un minuto, optimizando el tiempo de supervisión del familiar.
                        </Typography>
                    </li>
                </Box>
            </Box>
        )
    },
    {
        id: 'panel6',
        icon: <CalendarMonthRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Gestión de eventos',
        description: (
            <Box sx={{ color: '#000000' }}>
                <Typography variant='body1' sx={{ lineHeight: 1.6, mb: 2 }}>
                    Teresa centraliza la planificación de eventos y citas críticas, permitiendo que usted supervise la agenda del adulto mayor en tiempo real. Este sistema garantiza que los compromisos de salud y bienestar estén siempre bajo control.
                </Typography>

                <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 2 } }}>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Control de Eventos mediante Voz:</strong> El usuario puede dar de alta citas simplemente indicándolo verbalmente (ej: <em>"Agregá una cita con el médico el lunes a las 15:00"</em>). Teresa procesa la instrucción e impacta el cambio de forma inmediata.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Supervisión de Compromisos:</strong> Usted podrá visualizar el resumen semanal de actividades desde este panel. El comando <em>"¿Qué tengo programado?"</em> permite que Teresa asista al usuario en la recordación de sus tareas, reduciendo el riesgo de omisiones.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Sincronización con Google Calendar:</strong> Al vincular la cuenta de correo electrónico, los eventos se sincronizan bidireccionalmente. Esto permite que cualquier cambio realizado por Teresa sea visible en sus dispositivos personales y viceversa.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" component="span">
                            <strong>Edición Dinámica:</strong> Teresa cuenta con facultades para modificar o eliminar entradas existentes bajo demanda, manteniendo la agenda del hogar siempre actualizada y precisa.
                        </Typography>
                    </li>
                </Box>
            </Box>
        )
    },
];

const ManualFamiliar = () => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
                width: "100%",
                height: "100%",
                overflow: "auto",
                background: `url(${fondoChatAI})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                p: 2,
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "100%",
                    p: { xs: 2, sm: 2, md: 2 },
                    borderRadius: 4,
                    background: "transparent",
                    flexGrow: 0,
                    boxShadow: 0,
                    animation: "slideDown 0.4s ease",
                    "@keyframes slideDown": {
                        from: {
                            opacity: 0,
                            transform: "translateY(-40px)"
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    }
                }}
            >
                <Typography variant="h3"
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "center", sm: "center", md: "flex-start" },
                        alignItems: "center",
                        color: "#000000",
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.5rem",
                            lg: "1.7rem",
                            xl: "1.8rem"
                        },
                        mb: 1
                    }}>
                    Manual de uso <AutoStoriesRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
                </Typography>
                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 2 }} />
                <Box sx={{
                    width: '100%', margin: 'auto', animation: "slideDown 0.4s ease",
                    "@keyframes slideDown": {
                        from: {
                            opacity: 0,
                            transform: "translateY(-40px)"
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    }
                }}>
                    {steps.map((step) => (
                        <Accordion
                            key={step.id}
                            expanded={expanded === step.id}
                            onChange={handleChange(step.id)}
                            sx={{
                                mb: 1.5,
                                borderRadius: '12px !important',
                                '&:before': { display: 'none' },
                                boxShadow: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#7d745c' }} />}
                                sx={{
                                    bgcolor: "#d7d6d6",
                                    '&:hover': { backgroundColor: '#c1c1c1' },
                                    color: '#000000',
                                    py: 1
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {step.icon}
                                    <Typography sx={{ fontWeight: '600', fontSize: '1.1rem', color: '#000000' }}>
                                        {step.label}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ backgroundColor: '#eeeeee', borderTop: '1px solid #eee', p: 3 }}>
                                {step.description}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Paper>
        </Box>
    )
};

export default ManualFamiliar;