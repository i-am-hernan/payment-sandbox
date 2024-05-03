import { Provider } from "react-redux";
import { store } from "../store";
import { createTheme, ThemeProvider } from "@mui/material";
import { themeOptions } from "../components/theme";

const Home: any = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={themeOptions}>
        <h1>Welcome</h1>
      </ThemeProvider>
    </Provider>
  );
};

export default Home;
