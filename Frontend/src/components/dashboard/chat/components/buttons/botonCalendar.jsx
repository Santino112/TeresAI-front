import Button from '@mui/material/Button';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import axios from 'axios';
import { supabase } from "../../../../../supabaseClient.js"

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
      my: 1,
      mb: 1,
      boxShadow: 3,
      color: "#ffffff",
      backgroundColor: "#0978a0",
      fontFamily: "'Lora', serif",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#066688",
      }
    }}>
      <CalendarMonthRoundedIcon sx={{ mr: 1 }} />Google Calendar
    </Button>
  );
};

export default BotonCalendar;