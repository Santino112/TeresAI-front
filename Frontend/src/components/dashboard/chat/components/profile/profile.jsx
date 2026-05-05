import { useEffect, useState } from "react";
import { useAuth } from "../../../../auth/useAuth.jsx";
import { tomarDatosPerfiles } from "../../exports/datosInicialesUsuarios";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import ProfileElder from "./tiposProfile/ProfileElder";
import ProfileFamiliar from "./tiposProfile/ProfileFamiliar";
import ProfileCuidador from "./tiposProfile/ProfileCuidador";
import { Typography, Box, CircularProgress } from "@mui/material";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const fetchInfoUser = async () => {
            try {
                if (profile) return;

                const data = await tomarDatosPerfiles(user.id);

                if (data) {
                    setProfile(data);
                } else {
                    console.warn("No se encontraron datos de perfil para este usuario.");
                }
            } catch (error) {
                console.error("Error al obtener perfil del usuario:", error);
            }
        };

        fetchInfoUser();
    }, [user?.id]);

    return (

        <Box
            sx={{
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
                p: 2
            }}
        >
            {!profile ? (
                <Box sx={{ p: 5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, flexGrow: 1 }}>
                    <Typography variant="h2" sx={{ fontSize: "1rem", fontFamily: "'Lora', serif", color: "#000000" }}>Cargando perfil...</Typography>
                    <CircularProgress sx={{ color: "#000000" }} />
                </Box>
            ) : profile?.role === "elder" ? <ProfileElder profile={profile} setProfile={setProfile} />
                : profile?.role === "familiar" ? <ProfileFamiliar profile={profile} setProfile={setProfile} />
                    : <ProfileCuidador profile={profile} setProfile={setProfile} />
            }
        </Box>
    );
};

export default Profile;
