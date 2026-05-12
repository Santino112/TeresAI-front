import { supabase } from "../../../../supabaseClient";

const isNetworkFetchError = (error) => {
    const message = String(error?.message || "");
    return message.includes("NetworkError") || message.includes("Failed to fetch");
};

const normalizeContactIdentifier = (value) => {
    const contact = String(value || "").trim();

    if (!contact) return "";
    if (contact.includes("@")) return contact.toLowerCase();

    return contact.replace(/\s+/g, "");
};

const findProfileByContact = async (contact) => {
    const normalized = normalizeContactIdentifier(contact);

    if (!normalized) return { data: null, error: null };

    const { data: emailData, error: emailError } = await supabase
        .schema("public")
        .from("profiles")
        .select("id, role, email, phone")
        .eq("email", normalized)
        .maybeSingle();

    if (emailData || emailError) {
        return { data: emailData, error: emailError };
    }

    const { data: phoneData, error: phoneError } = await supabase
        .schema("public")
        .from("profiles")
        .select("id, role, email, phone")
        .eq("phone", normalized)
        .maybeSingle();

    return { data: phoneData, error: phoneError };
};

//Almacenar la información en supabase
////////////////////////////////////////
export const saveProfile = async (userId, { username, role, email, phone }) => {
    const payload = {
        id: userId,
        username,
        role,
        email,
    };

    if (phone) {
        payload.phone = phone;
    }

    const { error } = await supabase
        .schema("public")
        .from("profiles")
        .insert(payload);

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

export const familyPeople = async (userId, { nombreElder, relacion, numeroTelefono }) => {
    const { error } = await supabase
        .schema("public")
        .from("family_profiles")
        .insert({
            id: userId,
            nombreElder,
            relacion,
            numeroTelefono
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
    if (!userId) return null;

    const { data, error } = await supabase
        .schema("public")
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    if (error) throw error;
    return data;
};

export const tomarDatosElder = async (userId) => {
    if (!userId) return null;

    const { data, error } = await supabase
        .schema("public")
        .from("elder_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    if (error) {
        if (isNetworkFetchError(error)) {
            console.warn("No se pudo conectar con Supabase al obtener el perfil del adulto mayor.");
            return null;
        }
        console.error("Error al obtener los datos del usuario", error);
        return null;
    }
    return data;
};

export const tomarDatosFamiliares = async (userId) => {
    if (!userId) return null;

    const { data, error } = await supabase
        .schema("public")
        .from("family_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    if (error) {
        if (isNetworkFetchError(error)) {
            console.warn("No se pudo conectar con Supabase al obtener el perfil familiar.");
            return null;
        }
        console.error("Error al obtener los datos del usuario", error);
        return null;
    }
    return data;
};

export const tomarDatosCuidadores = async (userId) => {
    if (!userId) return null;

    const { data, error } = await supabase
        .schema("public")
        .from("caregiver_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    if (error) {
        if (isNetworkFetchError(error)) {
            console.warn("No se pudo conectar con Supabase al obtener el perfil del cuidador.");
            return null;
        }
        console.error("Error al obtener los datos del usuario", error);
        return null;
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

export const actualizarDatosFamiliares = async (userId, { relacion, nombreElder, numeroTelefono }) => {
    const { error } = await supabase
        .schema("public")
        .from("family_profiles")
        .update({
            relacion,
            nombreElder,
            numeroTelefono
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
    const { data: elderData, error: elderError } = await findProfileByContact(emailFamiliar);

    if (elderError || !elderData) {
        return { success: false, message: "No existe un usuario con ese correo o teléfono. Vuelva a intentar." };
    } else if (elderData.role !== "elder") {
        return { success: false, message: "El contacto no corresponde a un adulto mayor." };
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
        if (error.message.includes("unique_link") || error.message.includes("duplicate key value")) {
            return { success: false, message: "Ya estás vinculado con ese adulto mayor." };
        }
        return { success: false, message: error.message };
    }
    return { success: true };
};

//Eliminamos el control sobre un elder
export const desvincularUsuarios = async (userId, emailElder) => {
    const { data: elderData, error: elderError } = await findProfileByContact(emailElder);

    if (elderError || !elderData) {
        return { success: false, message: "No existe un usuario con ese correo o teléfono. Vuelva a intentar." };
    } else if (elderData.role !== "elder") {
        return { success: false, message: "El contacto no corresponde a un adulto mayor." };
    };

    const { error: deleteError } = await supabase
        .schema("public")
        .from("links")
        .delete()
        .eq('elder_id', elderData.id)
        .eq('linked_id', userId);

    if (deleteError) {
        return {
            success: false,
            message: "Error al eliminar el vínculo: " + deleteError.message
        };
    };

    return { success: true };
};

//Actualizar datos de la cuenta
export const updateEmail = async (userId, { nuevoEmail }) => {

    const { error } = await supabase.auth.updateUser({
        email: nuevoEmail
    });

    if (error) {
        console.log("Error supabase:", error.message);
        return { success: false, message: error.message };
    }
    return { success: true, message: "Actualizado con éxito, revisa tu casilla de email para confirmarlo" };
};

export const updateContraseña = async (userId, { nuevaContraseña }) => {

    const { error } = await supabase.auth.updateUser({
        password: nuevaContraseña
    });

    if (error) {
        console.log("Error supabase:", error.message);
        return { success: true, message: error.message };
    };
    return { success: true, message: "Contraseña actualizada con éxito" };
};
