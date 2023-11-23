import "../index.css";
import { Box, Flex, Text, Button, Checkbox } from "@chakra-ui/react";
import { ControlledInput } from "../components/ControlledInput";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import users from "../temp/users";

import axios from "../api/axios";
const LOGIN_URL = "/auth";

interface response {
  roles?: [];
  accessToken?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const { auth, setAuth } = useContext(AuthContext);
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
      // const response = await axios.post(
      //   LOGIN_URL,
      //   JSON.stringify({ user, pwd }),
      //   {
      //     headers: { "Content-Type": "application/json" },
      //     withCredentials: true,
      //   }
      // );

      // console.log(JSON.stringify(response?.data));

      let response: response = {};
      if (user in users) {
        response = users[user];
      } else {
        throw new Error();
      }
      console.log(response);
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      const accessToken = response?.accessToken;
      const roles = response?.roles;
      setAuth({ user, pwd, roles, accessToken });
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
        console.log(err);
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

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
    </Box>
  );
};

export default Login;
