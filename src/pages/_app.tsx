import '../styles/globals.css'
import type { AppProps } from 'next/app'
/*import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';*/
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
      //<ThemeProvider theme=None>
      //<CssBaseline />
      <Component {...pageProps} />
      //</ThemeProvider>
  )
}
