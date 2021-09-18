import React from "react";
import PropTypes from "prop-types";
import {
  ThemeProvider,
  StylesProvider,
  jssPreset,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { theme } from "../styles/theme";
import LayoutAuth from "../Layout";
import { Provider } from "next-auth/client";
import { useRouter } from "next/router";
export default function MyApp(props: any) {
  const { Component, pageProps } = props;
  const router = useRouter();
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  switch (router.pathname) {
    case "/auth/signin":
      return (
        <Provider session={pageProps.session}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      );
    case "/404":
      return (
        <Provider session={pageProps.session}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      );
    default:
      return (
        <Provider session={pageProps.session}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LayoutAuth {...pageProps}>
              <Component {...pageProps} />
            </LayoutAuth>
          </ThemeProvider>
        </Provider>
      );
  }
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
