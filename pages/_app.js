import "../styles/theme.css";
import "../styles/output.css";
import "../styles/index.scss";
import { ThemeProvider, moonDesignLight } from "@heathmont/moon-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={moonDesignLight}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
