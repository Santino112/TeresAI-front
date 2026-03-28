import { createTheme } from '@mui/material';

export const Theme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'sans-serif',
    },
    components: {
        MuiPopover: {
            defaultProps: {
                disableScrollLock: true,  // ← no toca el overflow del body
            },
        },
        MuiModal: {
            defaultProps: {
                disableScrollLock: true,
            },
        },
    },
});