import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../../../../supabaseClient.js"
import { useAuth } from "../../../../auth/AuthContext.jsx";
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

function IconMenu({ setPaginaActiva }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchInfoUser = async () => {
            const data = await tomarDatosPerfiles(user.id);
            if (data) setProfile(data);
        }
        fetchInfoUser();
    }, [user, profile]);

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
            backgroundColor: "#030414",
        }}  >
            <Button
                id='basic-button'
                fullWidth
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ color: "#ffffff", justifyContent: "flex-start", p: 2 }}
            >
                <Avatar sx={{ mr: 2, color: "#ffffff" }}>{stringAvatar(profile?.username)}</Avatar>
                {profile?.username || "Usuario"}
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
                        backgroundColor: "#303030",
                        color: "#ffffff",
                        borderRadius: 3
                    }
                }}
                PaperProps={{
                    sx: { backgroundColor: "#303030", color: "#ffffff", minWidth: {xs: "53%", sm: "30%", md: "22%", lg: "17%", xl: "13%"}, p: 0, borderRadius: 3 }
                }}
            >
                <MenuItem disabled sx={{borderRadius: 3}}>
                    <Typography variant='body2' sx={{position: "relative", left: "7px"}}>{profile?.email}</Typography>
                </MenuItem>
                <Divider sx={{
                    width: "100%",
                    "&::before, &::after": {
                        borderColor: "#ffffff",
                    },
                    m: 0,
                    p: 0
                }}>
                </Divider>
                <MenuItem onClick={() => { 
                    setPaginaActiva("perfil");
                    setAnchorEl(false);
                }} sx={{borderRadius: 3}}>
                    <PersonRoundedIcon fontSize='medium' sx={{ mr: 1 }} />Perfil
                </MenuItem>
                <MenuItem sx={{borderRadius: 3}}>
                    <AutoAwesomeRoundedIcon fontSize='medium' sx={{ mr: 1 }} /> Personalizar
                </MenuItem>
                <Divider sx={{
                    width: "100%",
                    "&::before, &::after": {
                        borderColor: "#ffffff",
                    },
                    m: 0,
                    p: 0
                }}>
                </Divider>
                <MenuItem onClick={handleLogOut} sx={{borderRadius: 3}}>
                    <LogoutRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Cerrar sesión
                </MenuItem>
            </Menu>
        </Box >
    );
}

export default IconMenu;