import React from 'react';
import { useState } from 'react';
import { Typography, Button, TextField, Box, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';

const steps = [
    {
        id: 'panel1',
        icon: <HelpOutlineRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: "¿Qué puedes decirle a Teresa?",
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                Ella está diseñada para acompañarte en <strong>todo</strong> momento. Puedes consultarle dudas de la vida diaria, mantener una charla casual o pedirle consejos.
                <br /><br />
                Lo más importante: es tu <strong>cuidadora 24/7</strong>, capaz de organizar tu agenda, recordarte tareas críticas, armar tu lista de compras y estar pendiente de lo que necesites en cualquier momento del día.
            </Typography>
        )
    },
    {
        id: 'panel2',
        icon: <ErrorOutlineRoundedIcon sx={{ mr: 2, color: '#d32f2f' }} />,
        label: 'Emergencias',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                En caso de <strong>emergencia</strong>, Teresa puede notificar de inmediato a tu familiar o cuidador vinculado. Con solo pedírselo, ellos recibirán un aviso para estar al tanto de lo que sucede al instante.
            </Typography>
        )
    },
    {
        id: 'panel3',
        icon: <ChatBubbleOutlineRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Hablar con Teresa',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                Para hablar con Teresa, utiliza el campo de texto centrado en pantalla. Aquí puedes escribir consultas, números o cualquier información.
                <br /><br />
                Debajo del campo de texto encontrarás tres herramientas principales:
                <br /><br />
                • El botón <strong>enviar</strong> <ArrowUpwardRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> aparecerá al escribir y sirve para procesar tu mensaje.
                <br />
                • Si prefieres usar tu voz, mantén presionado el botón de <strong>audio</strong> <MicOffRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> y suéltalo al terminar de hablar.
                Recuerda tener activado tu micrófono en tu dispositivo móvil o en tu navegador de preferencia para que esta función funcione correctamente.
                <br />
                • A la izquierda, el botón de <strong>voz</strong> <VolumeOffRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> permitirá que la IA lea sus respuestas en voz alta.
            </Typography>
        )
    },
    {
        id: 'panel4',
        icon: <SearchRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Búsqueda de conversaciones',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                Para buscar las conversaciones que tuviste con teresa, haz clic en <strong><SearchRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> Buscar conversaciones</strong> ubicado en el panel lateral izquierdo de la pantalla. <br></br>
                Al hacer clic, se abrirá un campo de búsqueda donde podrás escribir palabras clave o frases para encontrar conversaciones específicas. En el cuadrante grande se mostrará los resultados relacionados con tu búsqueda, facilitando el acceso a información importante que hayas compartido en el pasado. <br></br>
                Luego, podrás hacer clic sobre alguno de estos resultados y la aplicación te llevará directamente a esa conversación, permitiéndote revisar el contexto completo y continuar la interacción que tuviste con teresa previamente.
            </Typography>
        )
    },
    {
        id: 'panel5',
        icon: <CalendarMonthRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Gestión de eventos',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                Teresa puede ayudarte a organizar y gestionar tus citas y eventos importantes. <br></br>
                Para crear un nuevo evento, simplemente decile a teresa algo como <strong>"Agrega una cita con el doctor el próximo lunes a las 3 PM"</strong>. Ella se encargará de agregarlo a tu calendario.<br></br>
                También puedes pedirle que te muestre tu agenda diciendo <strong>"¿Qué tengo programado para esta semana?"</strong> y teresa te proporcionará un resumen de tus próximos eventos, ayudándote a mantenerte organizado y al tanto de tus compromisos.<br></br>
                Además, si necesitas modificar o eliminar un evento, solo tienes que decírselo a teresa, por ejemplo: <strong>"Cambia mi cita con el doctor al martes a las 4 PM"</strong> o <strong>"Elimina mi cita con el doctor"</strong>, y ella se encargará de hacer los cambios necesarios en tu calendario.<br></br>
                Por último, puedes conectarte a tu cuenta de Google Calendar con tu email para que tus eventos se sincronicen con la aplicación, permitiendo asi que teresa tenga acceso a ellos y que tú los puedas ver en la pantalla.
            </Typography>
        )
    },
    {
        id: 'panel6',
        icon: <ExtensionRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Juegos',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                En la sección de juegos, encontrarás 2 juegos para ejercitar tu mente y mantenerla activa, Sudoku y Crucigrama.<br></br>
                Estos juegos están diseñados para ser divertidos y estimulantes, brindándote una forma entretenida de ejercitar tu cerebro.<br></br>
                Para jugarlo simplemente seleccionas la dificultad, y clickea en las casillas para ingresar los números o letras correspondientes. Si necesitas ayuda, puedes pedirle a teresa que te de una pista o que resuelva el juego por completo. <br></br>
            </Typography>
        )
    },
    {
        id: 'panel7',
        icon: <NewspaperRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Noticias',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                En la sección de noticias, encontrarás las últimas actualizaciones y eventos importantes. <br></br>
                Puedes pedirle a teresa que te mantenga informado sobre temas específicos o que te proporcione un resumen diario de las noticias más relevantes. <br></br>
                Puedes presionar el boton <strong>Actualizar</strong> para refrescar la pantalla y traer las noticias más recientes.
            </Typography>
        )
    },
    {
        id: 'panel8',
        icon: <ShoppingCartRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Lista de compras',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                Teresa puede ayudarte a crear y gestionar tu lista de compras. <br></br>
                Para agregar un artículo a tu lista, simplemente dile algo como <strong>"Agrega leche a mi lista de compras"</strong>. Teresa se encargará de añadirlo a tu lista.<br></br>
                También puedes agregar un artículo manualmente apretando en <strong>"Agregar artículo"</strong> y llenando la información necesaria del mismo. <br></br>
                Para eliminar un artículo, solo tienes que decirle a Teresa <strong>"Elimina leche de mi lista de compras"</strong> o apretando en el botón <strong>Eliminar artículos</strong>. <br></br>
                Además, puedes marcar los artículos como comprados para mantener tu lista organizada y asegurarte de no olvidar nada importante durante tus compras.
            </Typography>
        )
    },
    {
        id: 'panel9',
        icon: <StickyNote2RoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: 'Notas',
        description: (
            <Typography variant='body1' sx={{ lineHeight: 1.8, color: '#000000' }}>
                En la sección de notas, puedes crear y gestionar tus notas personales. <br></br>
                Para crear una nueva nota, simplemente dile a Teresa algo como <strong>"Crea una nueva nota"</strong>. Ella te pedirá que ingreses el contenido de la nota y se encargará de guardarla para ti.<br></br>
                También puedes crear una nota manualmente apretando en <strong>"Agregar nota"</strong> y llenando la información necesaria de la misma. <br></br>
                Para eliminar una nota, solo tienes que decirle a Teresa <strong>"Elimina la nota sobre mi cita médica"</strong> o apretando en el botón <strong>Eliminar notas</strong>. Otra forma es abriendo la nota manualmente y eliminándola desde ahí.<br></br>
            </Typography>
        )
    }
];

const Manual = () => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
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
                p: 2,
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "100%",
                    p: { xs: 2, sm: 2, md: 2 },
                    borderRadius: 4,
                    background: "transparent",
                    flexGrow: 0,
                    boxShadow: 0,
                    animation: "slideDown 0.4s ease",
                    "@keyframes slideDown": {
                        from: {
                            opacity: 0,
                            transform: "translateY(-40px)"
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    }
                }}
            >
                <Typography variant="h3"
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "center", sm: "center", md: "flex-start" },
                        alignItems: "center",
                        color: "#000000",
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.5rem",
                            lg: "1.7rem",
                            xl: "1.8rem"
                        },
                        mb: 1
                    }}>
                    Manual de uso <AutoStoriesRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
                </Typography>
                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 2 }} />
                <Box sx={{
                    width: '100%', margin: 'auto', animation: "slideDown 0.4s ease",
                    "@keyframes slideDown": {
                        from: {
                            opacity: 0,
                            transform: "translateY(-40px)"
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    }
                }}>
                    {steps.map((step) => (
                        <Accordion
                            key={step.id}
                            expanded={expanded === step.id}
                            onChange={handleChange(step.id)}
                            sx={{
                                mb: 1.5,
                                borderRadius: '12px !important',
                                '&:before': { display: 'none' },
                                boxShadow: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#7d745c' }} />}
                                sx={{
                                    bgcolor: "#d7d6d6",
                                    '&:hover': { backgroundColor: '#c1c1c1' },
                                    color: '#000000',
                                    py: 1
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {step.icon}
                                    <Typography sx={{ fontWeight: '600', fontSize: '1.1rem', color: '#000000' }}>
                                        {step.label}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ backgroundColor: '#eeeeee', borderTop: '1px solid #eee', p: 3 }}>
                                {step.description}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Paper>
        </Box>
    )
};

export default Manual;