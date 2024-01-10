import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Route } from "react-router-dom";
import SignUp from "../pages/SignUp.tsx";
import Login from "../pages/Login.tsx";
import { Password } from "../pages/PassWord.tsx";
import HomeLayout from "../layouts/HomeLayout.tsx";
// import { AuthProvider } from "./context/AuthProvider.tsx";
import RequireAuth from "../components/RequireAuth.tsx";

import NoteContainer from "../pages/Notes/NoteContainer.tsx";
import Favorite from "../pages/Favorite.tsx";
import TreeAndEditorContainer from "../layouts/TreeAndEditorContainer.tsx";
import RootLayout from "../layouts/RootLayout.tsx";

export const router = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="password" element={<Password />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<HomeLayout />}>
            <Route element={<TreeAndEditorContainer />}>
              <Route path="/notes" element={<NoteContainer />} />
              <Route path="/favorite" element={<Favorite />} />
            </Route>
          </Route>
        </Route>
      </>
    )
  );
};
