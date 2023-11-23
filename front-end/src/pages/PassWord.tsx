import { Box, Flex, Text, Button, Checkbox } from "@chakra-ui/react";
import { ControlledInput } from "../components/ControlledInput";
import { useState } from "react";

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
            Enter your registered email below to receive password reset
            instruction
          </Text>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "2em" }}
        >
          <ControlledInput label="Enter email"></ControlledInput>
          <Button
            colorScheme="brand"
            backgroundColor="brand.400"
            color="white"
            w="100%"
            size="lg"
          >
            SEND
          </Button>
        </div>
      </Flex>
    </Flex>
  );
};

// export const CheckMail = () => {
//     return ()
// };

// export const CreateNewPassword = () => {
//     return ()
// };

// export const Confirmed = () => {
//     return ()
// };
