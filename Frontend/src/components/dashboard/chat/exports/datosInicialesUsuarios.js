import { supabase } from "../../../../supabaseClient";

export const saveProfile = async (userId, { username, role, email }) => {
    const { error } = await supabase
        .schema("public")
        .from("profiles")
        .insert({
            id: userId,
            username,
            role,
            email,
        });

    if (error) {
        console.error("Error guardando el perfil", error);
        return false;
    };
    return true;
};

export const elderPeople = async (userId, { enfermedades, medicamentos, alergias, molestias, intereses }) => {
    const { error } = await supabase
        .schema("public")
        .from("elder_profiles")
        .insert({
            id: userId,
            enfermedades,
            medicamentos,
            alergias,
            molestias,
            intereses
        });

    if (error) {
        console.error("Error guardando los datos del elder", error);
        return { success: false, message: error.message };
    };
    return { success: true };
}

export const familyPeople = async (userId, { relacion, nombreelder }) => {
    const { error } = await supabase
        .schema("public")
        .from("family_profiles")
        .insert({
            id: userId,
            relacion,
            nombreelder
        });

    if (error) {
        console.error("Error guardando los datos del familiar", error);
        return { success: false, message: error.message };
    };
    return { success: true };
}

export const caregivePeople = async (userId, { geriatrico, adultosmayores, infoamonitorear }) => {
    const { error } = await supabase
        .schema("public")
        .from("caregiver_profiles")
        .insert({
            id: userId,
            geriatrico,
            adultosmayores,
            infoamonitorear
        });

    if (error) {
        console.error("Error guardando los datos del cuidador", error);
        return { success: false, message: error.message };
    };
    return { success: true };
}

export const tomarDatosPerfiles = async (userId) => {
    const { data, error } = await supabase
        .schema("public")
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (error) {
        console.error("Error al obtener los datos del usuario", error);
        return false;
    }
    return data;
};

export const tomarDatosElder = async (userId) => {
    const { data, error } = await supabase
        .schema("public")
        .from("elder_profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (error) {
        console.error("Error al obtener los datos del usuario", error);
        return false;
    }
    return data;
};

export const tomarDatosFamiliares = async (userId) => {
    const { data, error } = await supabase
        .schema("public")
        .from("family_profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (error) {
        console.error("Error al obtener los datos del usuario", error);
        return false;
    }
    return data;
};

export const tomarDatosCuidadores = async (userId) => {
    const { data, error } = await supabase
        .schema("public")
        .from("caregiver_profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (error) {
        console.error("Error al obtener los datos del usuario", error);
        return false;
    }
    return data;
};


