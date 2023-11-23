import { Text, Input } from "@chakra-ui/react";

export const ControlledInput = ({ inputProps = {}, label, type = "text" }) => {
  return (
    <div>
      <Text fontSize="md" textAlign="left" mb="10px" color="text.inactive">
        {label}
      </Text>
      <Input
        {...inputProps}
        type={type}
        placeholder="Enter your value"
        size="lg"
      />
    </div>
  );
};
