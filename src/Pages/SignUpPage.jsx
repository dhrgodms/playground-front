import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SignUpForm from "../Articles/SignUpForm";

const SignUpPage = () => {
  return (
    <Flex justify={"center"}>
      <Box>
        <SignUpForm />
      </Box>
    </Flex>
  );
};

export default SignUpPage;
