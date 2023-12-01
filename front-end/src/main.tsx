import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.tsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login.tsx";
import { Password } from "./pages/PassWord.tsx";
import HomeLayout from "./layouts/HomeLayout.tsx";
// import { AuthProvider } from "./context/AuthProvider.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import Notes from "./pages/Notes.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="password" element={<Password />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<HomeLayout />}>
          <Route path="/notes" element={<Notes />} />
        </Route>
      </Route>
    </>
  )
);

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
        <RouterProvider router={router} />
      {/* </AuthProvider> */}
    </ChakraProvider>
  </React.StrictMode>
);
