import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import localFont from "@next/font/local";

export const gintoFont = localFont({
  src: [
    {
      path: "../../public/fonts/ginto/Ginto-Nord-500.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ginto/Ginto-Nord-600.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ginto/Ginto-Nord-700.woff",
      weight: "700",
      style: "normal",
    },
  ],
});

export const whitneyFont = localFont({
  src: [
    {
      path: "../../public/fonts/whitney/Whitney-300.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/whitney/Whitney-400.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/whitney/Whitney-500.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/whitney/Whitney-600.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/whitney/Whitney-700.woff",
      weight: "700",
      style: "normal",
    },
  ],
});

import { store } from "../app/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className={whitneyFont.className}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}
