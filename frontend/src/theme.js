import { createTheme } from "@mui/material/styles"
import Colors from "./utils/colors"

export const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: Colors.theme_red,
    },
    secondary: {
      main: Colors.theme_orange,
    },
    info: {
      main: Colors.theme_pink,
    },
    fillColor: {
      main: Colors.theme_red_light,
    },
    text: {
      main: Colors.theme_text,
    },
  },
  typography: {
    fontFamily: [
      "Mulish",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),

    seenEmail: {
      fontWeight: 200,
      fontFamily: "Mulish",
    },
    newEmail: {
      fontWeight: 600,
      fontFamily: "Mulish",
    },
  },
})
