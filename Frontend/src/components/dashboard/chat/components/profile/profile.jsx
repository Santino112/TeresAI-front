import { useEffect, useState } from "react";
import { useAuth } from "../../../../auth/AuthContext";
import { tomarDatosPerfiles } from "../../exports/datosInicialesUsuarios";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import ProfileElder from "./tiposProfile/profileElder";
import ProfileFamiliar from "./tiposProfile/profileFamiliar";
import ProfileCuidador from "./tiposProfile/profileCuidador";
import { Typography, Box, CircularProgress } from "@mui/material";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchInfoUser = async () => {
            const data = await tomarDatosPerfiles(user.id);
            if (data) setProfile(data);
        }
        fetchInfoUser();
    }, [user]);

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexGrow: 1,
                    width: "100%",
                    background: `url(${fondoChatAI})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    p: 2
                }}
            >
                {!profile ? (
                    <Box sx={{ p: 5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, flexGrow: 1 }}>
                        <Typography variant="h2" sx={{ fontSize: "1rem", fontFamily: "'Lora', serif" }}>Cargando perfil...</Typography>
                        <CircularProgress sx={{ color: "#ffffff" }} />
                    </Box>
                ) : profile?.role === "elder" ? <ProfileElder profile={profile} setProfile={setProfile} />
                    : profile?.role === "familiar" ? <ProfileFamiliar profile={profile} setProfile={setProfile} />
                        : <ProfileCuidador profile={profile} setProfile={setProfile} />
                }
            </Box>
        </Box>
    );
};

export default Profile;