import {
  Flex,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { ControlledInput } from "../components/ControlledInput";
import { useRef, useState } from "react";
import axios from "../api/axios";

const FORGOT_PASSWORD_URL = "/user/forgot_password";
export const Password = () => {
  const [state, setState] = useState(1);
  if (state === 1) {
    return <ForgotPassword />;
    //   } else if (state === 2){
    //     return <CheckMail/>
    //   }
    //   else if(state === 3){
    //     return <ResetPassword/>
  }
};
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isEmailSended, setIsEmailSended] = useState(false);
  const errRef = useRef<HTMLDivElement>(null);
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        FORGOT_PASSWORD_URL,
        JSON.stringify({ email: email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data) {
        setIsEmailSended(true);
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
            Forgot Password?
          </Text>

          <Text color="text.inactive" textAlign="center" pl="4em" pr="4em">
            Enter your registered email below to reset your password
          </Text>
          {isEmailSended && (
            <Alert status="info" sx={{ mb: "1em", mt: "1em"}}>
              <AlertIcon />
              Check your email to reset your password
            </Alert>
          )}
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
          style={{ display: "flex", flexDirection: "column", rowGap: "1em" }}
        >
          <ControlledInput
            inputProps={{
              onChange: (e) => setEmail(e.target.value),
              value: email,
              required: true,
            }}
            label="Enter email"
          ></ControlledInput>
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
