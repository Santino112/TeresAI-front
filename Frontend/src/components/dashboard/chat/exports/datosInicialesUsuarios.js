import { supabase } from "../../../../supabaseClient";

//Almacenar la información en supabase
////////////////////////////////////////
export const saveProfile = async (userId, { username, role, email }) => {
    const { error } = await supabase
        .schema("public")
        .from("profiles")
        .insert({
            id: userId,
            username,
            role,
            email
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

export const familyPeople = async (userId, { nombreElder, relacion }) => {
    const { error } = await supabase
        .schema("public")
        .from("family_profiles")
        .insert({
            id: userId,
            nombreElder,
            relacion
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
////////////////////////////////////////

//Tomar los datos de supabase
////////////////////////////////////////
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
////////////////////////////////////////

//Actualizar los datos de supabase
////////////////////////////////////////
export const actualizarDatosPerfiles = async (userId, { username, role }) => {
    const { error } = await supabase
        .schema("public")
        .from("profiles")
        .update({
            username,
            role
        })
        .eq("id", userId)

    if (error) {
        return { success: false, message: error.message };
    };
    return { success: true };
};

export const actualizarDatosElders = async (userId, { enfermedades, medicamentos, alergias, molestias, intereses }) => {
    const { error } = await supabase
        .schema("public")
        .from("elder_profiles")
        .update({
            enfermedades,
            medicamentos,
            alergias,
            molestias,
            intereses
        })
        .eq("id", userId)

    if (error) {
        return { success: false, message: error.message };
    };
    return { success: true };
};

export const actualizarDatosFamiliares = async (userId, { relacion, nombreElder }) => {
    const { error } = await supabase
        .schema("public")
        .from("family_profiles")
        .update({
            relacion,
            nombreElder
        })
        .eq("id", userId)

    if (error) {
        return { success: false, message: error.message };
    };
    return { success: true };
};

export const actualizarDatosCuidadores = async (userId, { geriatrico, adultosmayores, infoamonitorear }) => {
    const { error } = await supabase
        .schema("public")
        .from("caregiver_profiles")
        .update({
            geriatrico,
            adultosmayores,
            infoamonitorear
        })
        .eq("id", userId)

    if (error) {
        return { success: false, message: error.message };
    };
    return { success: true };
};

//Linkear a los elders con sus familiares y cuidadores

export const linkearUsuarios = async (userId, { emailFamiliar, rol }) => {
    
    const { data: elderData, error: elderError } = await supabase
        .schema("public")
        .from("profiles")
        .select("id, role")
        .eq("email", emailFamiliar)
        .single()

    if (elderError || !elderData) {
        return { success: false, message: "No existe un usuario con ese email. Vuelva a intentar." };
    } else if (elderData.role !== "elder") {
        return { success: false, message: "El email no corresponde a un adulto mayor." };
    }

    const { error } = await supabase
        .schema("public")
        .from("links")
        .insert({
            elder_id: elderData.id,
            linked_id: userId,
            linked_role: rol
        });

    if (error) {
        return { success: false, message: error.message };
    }
    return { success: true };
};