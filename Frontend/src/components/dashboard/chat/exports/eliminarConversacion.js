import { supabase } from "../../../../supabaseClient";

export const deleteConversation = async (convId) => {
    const { error } = await supabase
        .from('conversations')
        .delete()
        .eq("id", convId);

    if (error) {
        console.error('Error eliminando conversación', error);
        return false;
    }
    return true;
};