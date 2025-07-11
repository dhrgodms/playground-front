import {
    Card,
    CardHeader,
    CardFooter,
    Image,
    Heading,
    Text,
    Flex,
    Box, Tag, TagLeftIcon, TagLabel, HStack,
} from '@chakra-ui/react';
import {useNavigate} from "react-router-dom";
import React from "react";
import {ChatIcon, ViewIcon} from "@chakra-ui/icons";
import {AiFillHeart} from "react-icons/ai";

export const MainCard = ({ ListTitle, post}) => {
    const navigate = useNavigate();
    const btnRef = React.useRef();

    const  handleCardClick = () => {
        navigate(`/post/${post.id}`);
    };

    const trimContentTitle = (title)=>{
        return title?.length>10?title.slice(0,10)+"...":title;
    }
  return (
      <Card maxW="md" style={{cursor:'pointer'}} onClick={handleCardClick} ref={btnRef}>
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Box>
              <Heading size="lg">{ListTitle}</Heading>
              <Text>{"<"+trimContentTitle(post?.contentTitle)+">"}</Text>
            </Box>
          </Flex>
        </Flex>
      </CardHeader>
      <Image
        objectFit="cover"
        src={post?.thumbnail}
        alt="Chakra UI"
      />

      <CardFooter
        justify="center"
        flexWrap="wrap"
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
          <HStack spacing={3}>
              <Tag size={'md'} key={1} variant='subtle' colorScheme='gray'>
                  <TagLeftIcon boxSize='12px' as={ViewIcon} />
                  <TagLabel>{post?.views}</TagLabel>
              </Tag>
              <Tag size={'md'} key={2} variant='subtle' colorScheme='cyan'>
                  <TagLeftIcon boxSize='12px' as={ChatIcon} />
                  <TagLabel>{post?.commentCount}</TagLabel>
              </Tag>
              <Tag size={'md'} key={3} variant='subtle' colorScheme='pink'>
                  <TagLeftIcon boxSize='12px' as={AiFillHeart} />
                  <TagLabel>{post?.likes}</TagLabel>
              </Tag>
          </HStack>
      </CardFooter>
    </Card>
  );
};
