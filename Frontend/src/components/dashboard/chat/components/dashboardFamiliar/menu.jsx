import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../../../../supabaseClient.js";
import { useAuth } from "../../../../auth/useAuth.jsx";
import { tomarDatosPerfiles } from "../../exports/datosInicialesUsuarios.js";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';

function IconMenu({ setPaginaActiva }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const fetchInfoUser = async () => {
            const data = await tomarDatosPerfiles(user.id);
            if (data) setProfile(data);
        };

        fetchInfoUser();

        const channel = supabase
            .channel(`perfil-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    if (payload.new && payload.new.id === user?.id) {
                        console.log("Actualizando perfil con:", payload.new.username);
                        setProfile(prev => ({ ...prev, ...payload.new }));
                        console.log("setProfile llamado"); // 👈
                    }
                }
            );
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const handleLogOut = async () => {
        await supabase.auth.signOut();
        const { data } = await supabase.auth.getSession();
        setAnchorEl(false);
        navigate('/');
    }

    function stringAvatar(name) {
        if (!name) return "";

        const nameParts = name.trim().split(" ");

        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }

        return nameParts[0][0].toUpperCase();
    }

    return (
        <Box sx={{
            backgroundColor: "#eeeeee",
        }}  >
            <Button
                id='basic-button'
                fullWidth
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ color: "#000000", justifyContent: "flex-start", p: 2 }}
            >
                <Avatar sx={{ mr: 2, color: "#ffffff" }}>{stringAvatar(profile?.username)}</Avatar>
                {profile?.username.slice(0, 15) || "Usuario"}
                <ExpandLessRoundedIcon fontSize="small" sx={{ ml: "auto" }} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                MenuListProps={{
                    sx: {
                        p: 1,
                        fontSize: "21px",
                        backgroundColor: "#eeeeee",
                        color: "#000000",
                        borderRadius: 3
                    }
                }}
                PaperProps={{
                    sx: { backgroundColor: "#000000", color: "#ffffff", minWidth: { xs: "53%", sm: "30%", md: "22%", lg: "17%", xl: "13%" }, p: 0, borderRadius: 3 }
                }}
            >
                <MenuItem disabled sx={{ borderRadius: 3 }}>
                    <Typography variant='body2' sx={{ position: "relative", left: "7px" }}>{profile?.email || profile?.phone || "Sin contacto"}</Typography>
                </MenuItem>
                <Divider sx={{
                    width: "100%",
                    color: "#000000",
                    backgroundColor: "#9f9e9e",
                    "&::before, &::after": {
                        borderColor: "#000000",
                    },
                    m: 0,
                    p: 0
                }}>
                </Divider>
                <MenuItem onClick={() => {
                    setPaginaActiva("perfil");
                    setAnchorEl(false);
                }} sx={{ borderRadius: 3, color: "#000000", "&:hover": { backgroundColor: "#e1e1e1" } }}>
                    <PersonRoundedIcon fontSize='medium' sx={{ mr: 1 }} />Perfil
                </MenuItem>
                <MenuItem onClick={() => {
                    setPaginaActiva("manual");
                    setAnchorEl(false);
                }} sx={{ borderRadius: 3, color: "#000000", "&:hover": { backgroundColor: "#e1e1e1" } }}>
                    <AutoStoriesRoundedIcon fontSize='medium' sx={{ mr: 1 }} /> Manual de uso
                </MenuItem>
                <Divider sx={{
                    width: "100%",
                    color: "#000000",
                    backgroundColor: "#9f9e9e",
                    "&::before, &::after": {
                        borderColor: "#000000",
                    },
                    m: 0,
                    p: 0
                }}>
                </Divider>
                <MenuItem onClick={handleLogOut} sx={{ borderRadius: 3, color: "#000000", "&:hover": { backgroundColor: "#e1e1e1", color: "#ff6b6b" } }}>
                    <LogoutRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Cerrar sesión
                </MenuItem>
            </Menu>
        </Box >
    );
}

export default IconMenu;
