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
import { Search } from "../pages/Search.tsx";
import { Help } from "../pages/Help.tsx";
import TagContainer from "../pages/Tags/TagContainer.tsx";
import NotesInTag from "../pages/Tags/NotesInTag.tsx";
// import SharedNotes from "@/pages/Notes/SharedNotes.tsx";
import SharedNote from "@/pages/Notes/SharedNote.tsx";
import { Unauthorized } from "@/pages/Unauthorized.tsx";
import { ErrorBoundary } from "@/pages/ErrorBoundary.tsx";

export const router = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/"
          element={<RootLayout />}
          errorElement={<ErrorBoundary />}
        >
          <Route index element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="password" element={<Password />} />
        </Route>
        <Route element={<RequireAuth />} errorElement={<ErrorBoundary />}>
          <Route path="note/:noteId" element={<SharedNote />} />
          <Route element={<HomeLayout />}>
            <Route element={<TreeAndEditorContainer />}>
              <Route path="/notes" element={<NoteContainer />} />
              <Route path="/favorite" element={<Favorite />} />
              <Route path="/tags" element={<TagContainer />}>
                <Route path=":tagId" element={<NotesInTag />} />
              </Route>
              {/* <Route path="/shared/note" element={<SharedNotes />}> */}
              {/* <Route path="note/:noteId" element={<SharedNote />} /> */}
              {/* </Route> */}
              <Route path="/search" element={<Search />} />
              <Route path="/help" element={<Help />} />
            </Route>
          </Route>
        </Route>
      </>
    )
  );
};
