import { createTheme } from "@mui/material/styles";

/**
 * Minimální MUI theme. Barvy řešíme primárně přes CSS proměnné (viz index.css),
 * theme drží jen font a vypnutí defaultních zaoblení/ripple, ať MUI komponenty
 * sednou k minimalistickému vzhledu (ostré hrany, mono font).
 */
export const theme = createTheme({
  typography: {
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
  },
  shape: { borderRadius: 0 },
  palette: {
    background: { default: "#E4E7DE", paper: "#D7DCD0" },
    primary: { main: "#A8843C" },   // --obili
    secondary: { main: "#5E8A82" }, // --voda
    text: { primary: "#23291F", secondary: "rgba(35,41,31,.72)" },
  },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
  },
});
