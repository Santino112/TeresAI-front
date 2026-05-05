import Button from '@mui/material/Button';
import axios from 'axios';
import { supabase } from "../../../../../supabaseClient.js";
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

const BotonCalendar = () => {

  const connectCalendar = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      alert("Usuario no autenticado");
      return;
    }

    const res = await axios.get("http://localhost:3000/auth/google/connect", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    window.location.href = res.data.url;
  };

  return (
    <Button variant="contained" onClick={connectCalendar} sx={{
      borderRadius: 3,
      mb: 3,
      mr: { xs: 0, sm: 1 },
      boxShadow: 3,
      width: { xs: "100%", sm: "100%", md: "fit-content" },
      minWidth: "auto",
      whiteSpace: "nowrap",
      px: 2,
      backgroundColor: "#7d745c",
      color: "#ffffff",
      textTransform: "none",
      fontSize: "1.1rem",
      "&:hover": {
        backgroundColor: "#67604d"
      },
    }}>
      <EventAvailableRoundedIcon sx={{ mr: 1 }} />Conectase a Google Calendar
    </Button>
  );
};

export default BotonCalendar;