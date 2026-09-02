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
    background: { default: "#FBA8CB", paper: "#F794BE" },
    primary: { main: "#78334A" },   // --obili
    secondary: { main: "#6B8C84" }, // --voda
    text: { primary: "#2A2320", secondary: "rgba(42,35,32,.72)" },
  },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
  },
});
