import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Route } from "react-router-dom";
import SignUp from "../pages/SignUp.tsx";
import Login from "../pages/Login.tsx";
import { Password } from "../pages/PassWord.tsx";
import HomeLayout from "../layouts/HomeLayout.tsx";
import RequireAuth from "../components/RequireAuth.tsx";
import NoteContainer from "../pages/Notes/NoteContainer.tsx";
import Favorite from "../pages/Favorite.tsx";
import TreeAndEditorContainer from "../layouts/TreeAndEditorContainer.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import { Search } from "../pages/Search.tsx";
import TagContainer from "../pages/Tags/TagContainer.tsx";
import NotesInTag from "../pages/Tags/NotesInTag.tsx";
import PublicNote from "@/pages/Notes/PublicNote.tsx";
import { Unauthorized } from "@/pages/Unauthorized.tsx";
import { ErrorBoundary } from "@/pages/ErrorBoundary.tsx";
import { Shared } from "@/pages/Share/Shared.tsx";
import { SetCurrentNote } from "@/layouts/SetCurrentNote.tsx";
import { Wrapper } from "@/pages/Share/Wrapper.tsx";
import { SharedNotesTable } from "@/pages/Share/SharedNotesTable.tsx";

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
          <Route path="note/:noteId/shared/public" element={<PublicNote />} />
          <Route element={<HomeLayout />}>
            <Route path="/shared/table" element={<SharedNotesTable />} />
            <Route element={<TreeAndEditorContainer />}>
              <Route element={<SetCurrentNote />}>
                <Route path="/notes" element={<NoteContainer />}>
                  <Route path=":id" element={<NoteContainer />} />
                </Route>
                <Route path="/favorite" element={<Favorite />}>
                  <Route path=":id" element={<Favorite />} />
                </Route>
                <Route path="/tags" element={<TagContainer />}>
                  <Route path=":tagId" element={<NotesInTag />}>
                    <Route path=":id" element={<NotesInTag />} />
                  </Route>
                </Route>
                <Route path="/search" element={<Search />}>
                  <Route path=":id" element={<Search />} />
                </Route>
                <Route path="/shared" element={<Wrapper />}>
                  <Route path="/shared/:id" element={<Shared />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </>
    )
  );
};
