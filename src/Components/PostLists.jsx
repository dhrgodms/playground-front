import {
  Box,
  Card,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { MainCard } from "./MainCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import serverUrl, { serverUrlV2 } from "../Constants/Constants";
export const PostLists = () => {
  const [mainPostsdata, setMainPostsdata] = useState([]);
  const navigate = useNavigate();
  const btnRef = React.useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`${serverUrlV2}/posts`)
      .then((response) => {
        setMainPostsdata(response.data.content);
        setIsLoaded(true);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleCardClick = () => {
    navigate("/guestbook");
  };
  const GuestBookCard = ({ ListTitle }) => {
    return (
      <Card
        maxW="md"
        style={{ cursor: "pointer" }}
        onClick={handleCardClick}
        ref={btnRef}
      >
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Box>
                <Heading size="lg">방명록~</Heading>
                <Text>{"<방명록써주십사..>"}</Text>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
        <Image
          objectFit="cover"
          src={`${serverUrl}:8080/thumbnail/5_thumb.jpg`}
          alt="Chakra UI"
        />

        <CardFooter
          justify="center"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        ></CardFooter>
      </Card>
    );
  };

  return (
    <Skeleton fadeDuration={1} isLoaded={isLoaded}>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        <MainCard key={6} ListTitle={"인기글"} post={mainPostsdata[0]} />
        <MainCard key={5} ListTitle={"최신글"} post={mainPostsdata[1]} />
        <MainCard key={7} ListTitle={"생각글"} post={mainPostsdata[2]} />
        <MainCard key={8} ListTitle={"일상만화"} post={mainPostsdata[3]} />
        <MainCard key={9} ListTitle={"나의 playlist"} post={mainPostsdata[4]} />
        <GuestBookCard key={10} ListTitle={"방명록"} />
      </SimpleGrid>
    </Skeleton>
  );
};
