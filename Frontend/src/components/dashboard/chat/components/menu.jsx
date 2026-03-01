import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../../../supabaseClient.js"
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

function IconMenu() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogOut = async () => {
        await supabase.auth.signOut();
        const { data } = await supabase.auth.getSession();
        console.log(data.session);
        navigate('/');
    }

    return (
        <Box sx={{
            backgroundColor: "#626C66",
            borderRight: "1px solid #2f332f",
            p: 1
        }}  >
            <Button
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{color: "#ffffff"}}
            >
                <SettingsRoundedIcon />
            </Button>
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
                sx={{
                    width: 420, maxWidth: '100%', p: 0
                }}
            >
                <MenuList>
                    <MenuItem>
                        <ListItemIcon>
                            <AutoAwesomeRoundedIcon />
                        </ListItemIcon>
                        <ListItemText>Personalización</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogOut}>
                        <ListItemIcon>
                            <LogoutRoundedIcon />
                        </ListItemIcon>
                        <ListItemText>Cerrar sesion</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box >
    );
}

export default IconMenu;