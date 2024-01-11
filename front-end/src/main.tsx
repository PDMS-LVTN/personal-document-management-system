import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import "./tailwind.css";
import "@mdxeditor/editor/style.css";
import "./index.css";
import { router } from "./navigation/routerConfig.tsx";

const routerConfig = router()

const theme = extendTheme({
  fonts: {
    body: "Be Vietnam Pro, sans-serif",
    heading: "Be Vietnam Pro, serif",
    mono: "Be Vietnam Pro, monospace",
  },
  colors: {
    brand: {
      50: "#efe6ff",
      100: "#ccb8fd",
      200: "#aa8af7",
      300: "#895bf1",
      400: "#7540EE",
      500: "#4d13d3",
      600: "#3c0ea5",
      700: "#2a0977",
      800: "#190549",
      900: "#0b001d",
    },
    text: {
      inactive: "#7A7A7A",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* <AuthProvider> */}
      <RouterProvider router={routerConfig} />
      {/* </AuthProvider> */}
    </ChakraProvider>
  </React.StrictMode>
);
