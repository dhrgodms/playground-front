import { Box, Code, Flex } from "@chakra-ui/react";
import React, { Children } from "react";
import { PageTitle } from "../Atoms/PageTitle";
import { Slider } from "../Components/Slider";
const MainTemplate = ({ children, pageTitle, titleQuery }) => {
  return (
    <>
      <Flex minHeight={"100vh"} style={{ flexDirection: "column" }} bg="#F5F5F5">
        <Flex justify="center">
          <Box maxW="980px" width="100%" px={8} py={5} mx="auto" mb={2} borderRadius="lg">
            <Slider />
            <Flex
              gap={4}
              mt={4}
              p={4}
              justify={"center"}
              bg="#2C3E50"
              borderRadius="lg"
              shadow="sm"
              border="1px solid"
              borderColor="#34495E"
            >
              <Code children="console.log(welcome)" />
              <Code colorScheme="pink" children="글과 그림" />
              <Code colorScheme="yellow" children="사진" />
              <Code colorScheme="blue" children="PlayLists" />
            </Flex>
          </Box>
        </Flex>
        <Flex flex="8" justify="center">
          <Flex
            direction={"column"}
            gap={"30px"}
            width={"100%"}
            maxW="980px"
            px={8}
            py={5}
            justify={"center"}
            bg="white"
            borderRadius="lg"
            shadow="md"
            mt={2}
            border="1px solid"
            borderColor="#E2E8F0"
          >
            <PageTitle title={pageTitle} query={titleQuery} />
            {Children.toArray(children)}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default MainTemplate;
