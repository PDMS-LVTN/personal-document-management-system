import { Flex, Text, Button, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { ControlledInput } from "../components/ControlledInput";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const FORGOT_PASSWORD_URL = "/user/reset_password"

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const resetPasswordToken = queryParams.get("resetPasswordToken");

  const errRef = useRef<HTMLDivElement>(null);
  const [errMsg, setErrMsg] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        FORGOT_PASSWORD_URL,
        JSON.stringify({ email: email, password: pwd, resetPasswordToken: resetPasswordToken}),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data) {
        navigate("/login", { state: { isResetPassword: true } });
      }
    } catch (err) {
      setErrMsg(err.response?.data?.message);
      errRef.current.focus();
    }
  };

  return (
    <Flex p="5em" w="50%" justifyContent="center" alignItems="center">
      <Flex flexDirection="column" rowGap="5em">
        <div>
          <Text
            fontSize="5xl"
            fontWeight="semibold"
            color="brand.400"
            textAlign="center"
          >
            Reset Password
          </Text>

          <Text color="text.inactive" textAlign="center" pl="4em" pr="4em">
            Enter your new password below.
          </Text>
          <Alert
            status="error"
            ref={errRef}
            sx={{ display: errMsg ? "flex" : "none", mb: "1em", mt: "1em"}}
            aria-live="assertive"
          >
            <AlertIcon />
            <AlertDescription>{errMsg}</AlertDescription>
          </Alert>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "2em" }}
        >
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
            onClick={handleSubmit}
          >
            SEND
          </Button>
        </div>
      </Flex>
    </Flex>
  );
};

