import React, { Children } from "react";
import { Flex, Stack, Code } from "@chakra-ui/react";
import { Slider } from "../Components/Slider";
import { PageTitle } from "../Atoms/PageTitle";
const MainTemplate = ({ children, pageTitle, titleQuery }) => {
  return (
    <>
      <Flex height={"100vh"} style={{ flexDirection: "column" }}>
        <Flex>
          <Slider />
        </Flex>
        <Flex flex="8">
          <Flex
            direction={"column"}
            gap={"30px"}
            width={"100%"}
            m={5}
            justify={"center"}
          >
            <PageTitle title={pageTitle} query={titleQuery} />
            <Flex justify={"center"}>
              <Stack direction="row">
                <Code children="console.log(welcome)" />
                <Code colorScheme="pink" children="글과 그림" />
                <Code colorScheme="yellow" children="사진" />
                <Code colorScheme="blue" children="PlayLists" />
              </Stack>
            </Flex>
            {Children.toArray(children)}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default MainTemplate;
