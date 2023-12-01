import {
  Box,
  Flex,
  Text,
  Button,
  Checkbox,
  Divider,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { ControlledInput } from "../components/ControlledInput";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { useAuthentication } from "../store/useAuth";

const LOGIN_URL = "/auth/login";
const GGLOGIN_URL = "/auth/loginGoogle";

interface JwtPayload {
  email: string;
  sub: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/notes";

  // const { auth, setAuth } = useContext(AuthContext);
  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);
  const userRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(JSON.stringify(response?.data));
      // refresh token is saved to cookies by server
      setAuth({ email: user, accessToken: response?.data?.access_token });
      setUser("");
      setPwd("");
      console.log(from);
      console.log(auth);
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Wrong Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const handleCallbackResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const userObject: JwtPayload = jwtDecode(response.credential);
    console.log(userObject);
    try {
      const response = await axios.post(
        GGLOGIN_URL,
        JSON.stringify({ email: userObject.email, password: userObject.sub }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      setAuth({
        email: userObject.email,
        accessToken: response?.data?.access_token,
      });
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  // TODO:
  // - editor

  useEffect(() => {
    // global google
    google.accounts.id.initialize({
      client_id:
        "944399081621-abj2rgnnudn10ta6ng95hitjuaaacjih.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <Box p="5em" w="50%">
      <Flex flexDirection="column" rowGap="5em">
        <div>
          <Text
            fontSize="5xl"
            fontWeight="semibold"
            color="brand.400"
            textAlign="left"
          >
            Login
          </Text>

          <Text color="text.inactive" textAlign="left">
            Welcome back! Please login to your account.
          </Text>
        </div>
        <div>
          <p
            ref={errRef}
            // className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "2em",
            }}
          >
            <ControlledInput
              label="Enter email"
              inputProps={{
                onChange: (e) => setUser(e.target.value),
                ref: userRef,
                autoComplete: "off",
                value: user,
                required: true,
              }}
            ></ControlledInput>
            <ControlledInput
              label="Enter password"
              type="password"
              inputProps={{
                onChange: (e) => setPwd(e.target.value),
                value: pwd,
                required: true,
              }}
            ></ControlledInput>
            <Flex justifyContent="space-between">
              <Checkbox defaultChecked colorScheme="brand">
                Remember Me
              </Checkbox>
              <Text
                color="text.inactive"
                textAlign="right"
                _hover={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: "semibold",
                }}
              >
                <Link to="/password">Forgot Password?</Link>
              </Text>
            </Flex>
            <Button
              colorScheme="brand"
              backgroundColor="brand.400"
              color="white"
              w="100%"
              size="lg"
              onClick={handleSubmit}
            >
              LOGIN
            </Button>
          </form>
        </div>
      </Flex>
      <Box position="relative" padding="10">
        <Divider />
        <AbsoluteCenter bg="white" px="4" textColor="text.inactive">
          OR
        </AbsoluteCenter>
      </Box>

      <div
        id="signInDiv"
        style={{ display: "flex", justifyContent: "center" }}
      ></div>
    </Box>
  );
};

export default Login;
