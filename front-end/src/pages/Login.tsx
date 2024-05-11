import {
  Box,
  Flex,
  Text,
  Button,
  Checkbox,
  Divider,
  AbsoluteCenter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { ControlledInput } from "../components/ControlledInput";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
// import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { useAuthentication } from "../store/useAuth";
import { useApi } from "@/hooks/useApi";

const LOGIN_URL = "/auth/login";
const VERIFIED_EMAIL_URL = "/user/verify_email";
const GGLOGIN_URL = "/auth/loginGoogle";

interface JwtPayload {
  email: string;
  sub: string;
  picture: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const codeEmailConfirmed = queryParams.get('codeEmailConfirmed');
  const emailVerify = queryParams.get('email');

  const from = location.state?.from || "/notes";
  const isShared = location.state?.isShared;
  const isVerified = location.state?.isVerified;
  const isResetPassword = location.state?.isResetPassword;

  // const { auth, setAuth } = useContext(AuthContext);
  const setAuth = useAuthentication((state) => state.setAuth);
  // const auth = useAuthentication((state) => state.auth);
  const userRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    if (codeEmailConfirmed) {
      const verify_email = async () => {
        try {
          const response = await axios.post(
            VERIFIED_EMAIL_URL,
            JSON.stringify({ codeEmailConfirmed: codeEmailConfirmed, email: emailVerify }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response.data) {
            setIsEmailVerified(true);
          }
        } catch (err) {
          handleResponseError(err);
        }
      };

      verify_email();
    }
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const callApi = useApi();

  const checkPermissionWithEmail = async (noteId: string, email: string) => {
    const options = {
      method: "GET",
      params: { email },
    };
    const { responseData, responseError } = await callApi(
      `note_collaborator/${noteId}`,
      options
    );
    return { responseData, responseError };
  };
  const handleShareNavigation = async (email: string) => {
    const { responseData, responseError } = await checkPermissionWithEmail(
      location.state.noteId,
      email
    );
    if (responseError) {
      navigate("/unauthorized", {
        state: {
          isShared: true,
          noteId: location.state.noteId,
          from: from,
        },
      });
    } else {
      navigate(from, {
        replace: true,
        state: { data: responseData },
      });
    }
  };

  const handleResponseError = (err) => {
    console.log(err);
    if (!err?.response) {
      setErrMsg("No Server Response");
    } else if (err.response?.status === 406) {
      setErrMsg(err.response?.data?.message);
    } else if (err.response?.status === 401) {
      setErrMsg("Unauthorized");
    } else {
      setErrMsg("Login failed of unknown reason");
    }
    errRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAuth({
        email: user,
        accessToken: response?.data?.access_token,
        id: response?.data?.id,
        avatar: "/placeholder-image.jpg",
      });
      setUser("");
      setPwd("");
      if (isShared) {
        handleShareNavigation(user);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      handleResponseError(err);
    }
  };

  const handleCallbackResponse = async (response) => {
    const userObject: JwtPayload = jwtDecode(response.credential);
    try {
      const response = await axios.post(
        GGLOGIN_URL,
        JSON.stringify({ email: userObject.email, password: userObject.sub }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(userObject);
      setAuth({
        email: userObject.email,
        accessToken: response?.data?.access_token,
        id: response?.data?.id,
        avatar: userObject.picture,
      });
      if (isShared) {
        handleShareNavigation(userObject.email);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      handleResponseError(err);
    }
  };

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
    <Box p="5em" w="50%" overflow="auto">
      <Flex flexDirection="column" rowGap="4em">
        <div>
          <Text
            fontSize="5xl"
            fontWeight="semibold"
            color="brand.400"
            textAlign="left"
          >
            Login
          </Text>

          <div style={{ display: "flex", gap: "5px" }}>
            <Text color="text.inactive">Don't have an account yet?</Text>
            {/* <Link to="/"> */}
            <Text
              color="brand.400"
              _hover={{
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "semibold",
              }}
              onClick={() =>
                navigate("/", {
                  replace: true,
                  state: {
                    isShared: isShared,
                    from,
                    noteId: location.state?.noteId,
                  },
                })
              }
            >
              Signup
            </Text>
            {/* </Link> */}
          </div>
          {isShared && (
            <Alert status="info" sx={{ mb: "1em", mt: "1em" }}>
              <AlertIcon />
              Sign in to open this document
            </Alert>
          )}
          {!isShared && isVerified && (
            <Alert status="info" sx={{ mb: "1em", mt: "1em" }}>
              <AlertIcon />
              Check mail to login
            </Alert>
          )}
          {isEmailVerified && (
            <Alert status="success" sx={{ mb: "1em", mt: "1em" }}>
              <AlertIcon />
              Email {emailVerify} is verified
            </Alert>
          )}
          {isResetPassword && (
            <Alert status="success" sx={{ mb: "1em", mt: "1em" }}>
              <AlertIcon />
              Reset password successful
            </Alert>
          )}
          <Alert
            status="error"
            ref={errRef}
            sx={{ display: errMsg ? "flex" : "none", mb: "1em", mt: "1em" }}
            aria-live="assertive"
          >
            <AlertIcon />
            {/* <AlertTitle>Login failed</AlertTitle> */}
            <AlertDescription>{errMsg}</AlertDescription>
          </Alert>
        </div>
        <section>
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
        </section>
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
