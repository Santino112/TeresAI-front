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
      mb: 1,
      backgroundColor: "#EDEDED",
      color: "#2E2E2E",
      "&:hover": {
        backgroundColor: "#FFFFFF"
      }
    }}>
      <CalendarMonthRoundedIcon sx={{ mr: 1 }} />Calendario
    </Button>
  );
};

export default BotonCalendar;