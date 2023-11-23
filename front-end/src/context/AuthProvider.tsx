import { createContext, useState } from "react";

interface IAuth {
  user: string;
  pwd: string;
  roles: number[];
  accessToken: string;
}
interface IAuthContext {
  auth: IAuth; // Whatever you need to add here
  setAuth: (auth: IAuth) => void;
}

const AuthContext = createContext<IAuthContext>({
  //   auth: { user: "", pwd: "", roles: 0, accessToken: "" },
  auth: undefined,
  setAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: "",
    pwd: "",
    roles: [0],
    accessToken: "",
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
