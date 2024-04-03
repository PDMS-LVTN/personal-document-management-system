import {
  Box,
  Flex,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ControlledInput } from "../components/ControlledInput";
import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const USER_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/user/sign_up";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;
  const isShared = location.state?.isShared;

  const userRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    // const v2 = true;
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ email: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true,
        }
      );

      // TODO: remove console.logs before deployment
      console.log(response);
      console.log(JSON.stringify(response?.data));

      //clear state and controlled inputs
      setUser("");
      setPwd("");
      setMatchPwd("");
      navigate("/login", { state: { from, isShared } });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current?.focus();
    }
  };
  return (
    <Box sx={{ width: "50%", overflowY: "scroll" }} p="5em">
      <Flex flexDirection="column" rowGap="5em">
        <div>
          <Text
            fontSize="5xl"
            fontWeight="semibold"
            color="brand.400"
            textAlign="left"
          >
            Sign up
          </Text>
          <div style={{ display: "flex", gap: "5px" }}>
            <Text color="text.inactive">Already have an account?</Text>
            <Link to="/login">
              <Text
                color="brand.400"
                _hover={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: "semibold",
                }}
              >
                Log in
              </Text>
            </Link>
          </div>
        </div>
        <section>
          <Alert
            status="error"
            ref={errRef}
            sx={{ display: errMsg ? "flex" : "none", mb: "3em" }}
            aria-live="assertive"
          >
            <AlertIcon />
            <AlertTitle>Sign up failed</AlertTitle>
            <AlertDescription>{errMsg}</AlertDescription>
          </Alert>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "2em",
            }}
          >
            <ControlledInput
              type="email"
              label="Enter email"
              inputProps={{
                ref: userRef,
                onChange: (e) => setUser(e.target.value),
                value: user,
                required: true,
                "aria-invalid": validName ? "false" : "true",
                "aria-describedby": "uidnote",
                onFocus: () => setUserFocus(true),
                onBlur: () => setUserFocus(false),
              }}
            ></ControlledInput>
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              This is not a valid email address.
            </p>
            <ControlledInput
              label="Set password"
              type="password"
              inputProps={{
                onChange: (e) => setPwd(e.target.value),
                value: pwd,
                required: true,
                "aria-invalid": validPwd ? "false" : "true",
                "aria-describedby": "pwdnote",
                onFocus: () => setPwdFocus(true),
                onBlur: () => setPwdFocus(false),
              }}
            ></ControlledInput>
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            <ControlledInput
              label="Confirm password"
              type="password"
              inputProps={{
                onChange: (e) => setMatchPwd(e.target.value),
                value: matchPwd,
                required: true,
                "aria-invalid": validMatch ? "false" : "true",
                "aria-describedby": "confirmnote",
                onFocus: () => setMatchFocus(true),
                onBlur: () => setMatchFocus(false),
              }}
            ></ControlledInput>
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              Must match the first password input field.
            </p>
            <Button
              colorScheme="brand"
              backgroundColor="brand.400"
              color="white"
              w="100%"
              size="lg"
              disabled={!validName || !validPwd || !validMatch ? true : false}
              onClick={handleSubmit}
            >
              SIGN UP
            </Button>
          </form>
        </section>
      </Flex>
    </Box>
  );
};

export default SignUp;
