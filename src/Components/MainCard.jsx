import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Image,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from '@chakra-ui/react';
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const MainCard = ({ ListTitle, post }) => {
  const navigate = useNavigate();
  const btnRef = React.useRef();

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const trimContentTitle = (title) => {
    return title?.length > 10 ? title.slice(0, 10) + "..." : title;
  }
  return (
    <Card
      maxW="sm"
      style={{ cursor: 'pointer' }}
      onClick={handleCardClick}
      ref={btnRef}
      bg="white"
      color="#4A5568"
      border="1px solid"
      borderColor="#E2E8F0"
      shadow="sm"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
        borderColor: "#F7DC6F"
      }}
    >
      <CardHeader bg="#F8F9FA" borderBottom="1px solid" borderColor="#E2E8F0">
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Box>
              <Heading size="lg" color="#4A5568">{ListTitle}</Heading>
              <Text color="#A0AEC0">{"<" + trimContentTitle(post?.contentTitle) + ">"}</Text>
            </Box>
          </Flex>
        </Flex>
      </CardHeader>

      {/* 고정된 크기의 이미지 컨테이너 */}
      <Box
        width="100%"
        height="180px"
        position="relative"
        overflow="hidden"
        bg="#F8F9FA"
      >
        <Image
          src={post?.thumbnail}
          alt="썸네일"
          width="100%"
          height="100%"
          objectFit="cover"
          objectPosition="center"
        />
      </Box>

      <CardFooter
        justify="center"
        flexWrap="wrap"
        bg="#F8F9FA"
        borderTop="1px solid"
        borderColor="#E2E8F0"
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        <HStack spacing={3}>
          <Tag size={'md'} key={1} variant='solid' colorScheme='blue' bg="#2C3E50">
            <TagLeftIcon boxSize='12px' as={ViewIcon} />
            <TagLabel>{post?.views}</TagLabel>
          </Tag>
          <Tag size={'md'} key={2} variant='solid' colorScheme='cyan' bg="#34495E">
            <TagLeftIcon boxSize='12px' as={ChatIcon} />
            <TagLabel>{post?.commentCount}</TagLabel>
          </Tag>
          <Tag size={'md'} key={3} variant='solid' colorScheme='pink' bg="#E74C3C">
            <TagLeftIcon boxSize='12px' as={AiFillHeart} />
            <TagLabel>{post?.likes}</TagLabel>
          </Tag>
        </HStack>
      </CardFooter>
    </Card>
  );
};
