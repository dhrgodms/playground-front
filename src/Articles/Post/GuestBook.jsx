import { ArrowUpIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Skeleton,
  Text,
  Textarea,
  useToast,
  VStack
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import serverUrl from "../../Constants/Constants";
import SubTemplate from "../../Templates/SubTemplate";

const GuestBook = () => {
  const [guestbook, setGuestbook] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [guestbookData, setGuestbookData] = useState({
    commentContent: "",
    commentNickname: "",
    commentPassword: "",
  });
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/guestbook/all`)
      .then((response) => {
        setGuestbook(response.data);
        setIsLoaded(true);
      })
      .catch((error) => console.log(error));
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setGuestbookData({ ...guestbookData, [name]: value });
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();

    if (!guestbookData.commentNickname || !guestbookData.commentPassword || !guestbookData.commentContent) {
      toast({
        title: "모든 필드를 입력해주세요",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    try {
      axios
        .post(`${serverUrl}/api/guestbook/add`, {
          memberName: guestbookData.commentNickname,
          memberPassword: guestbookData.commentPassword,
          content: guestbookData.commentContent,
        })
        .then((res) => {
          setGuestbookData({
            commentContent: "",
            commentNickname: "",
            commentPassword: "",
          });
          setGuestbook([...guestbook, res.data]);
          if (res?.data) {
            toast({
              title: `방명록이 등록되었습니다! 📮`,
              status: "success",
              isClosable: true,
            });
          } else {
            toast({
              title: `방명록 등록에 실패했습니다`,
              status: "error",
              isClosable: true,
            });
          }
        });
    } catch (e) {
      console.error(e);
      toast({
        title: "방명록 등록에 실패했습니다",
        status: "error",
        isClosable: true,
      });
    }
  }


  const CommentList = () => (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor="#E2E8F0"
      color="#4A5568"
      boxShadow="sm"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '3px',
        bg: '#2C3E50',
        borderRadius: 'lg lg 0 0'
      }}
    >
      <Heading size="md" mb={4} color="#2C3E50" fontFamily="monospace">
        💬 방명록 ({guestbook?.length || 0}개)
      </Heading>
      <VStack spacing={4} maxH="400px" overflowY="auto">
        {guestbook?.map((comment, index) => (
          <Box
            key={comment.id}
            p={4}
            border="1px solid"
            borderColor="#E2E8F0"
            borderRadius="md"
            bg="#F8F9FA"
            width="100%"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <HStack spacing={3}>
                <Text fontSize="lg">👤</Text>
                <Heading size="sm" color="#2C3E50" fontFamily="monospace">
                  {comment.memberName}
                </Heading>
              </HStack>
              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                #{index + 1}
              </Badge>
            </Flex>
            <Text fontSize="sm" color="#4A5568" whiteSpace="pre-wrap" mt={2}>
              {comment.content}
            </Text>
          </Box>
        ))}
        {(!guestbook || guestbook.length === 0) && (
          <Text fontSize="sm" color="#718096" textAlign="center" py={8}>
            첫 번째 방명록을 남겨보세요! 💭
          </Text>
        )}
      </VStack>
    </Box>
  );

  const CommentForm = () => (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor="#E2E8F0"
      color="#4A5568"
      boxShadow="sm"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '3px',
        bg: '#2C3E50',
        borderRadius: 'lg lg 0 0'
      }}
    >
      <Heading size="md" mb={4} color="#2C3E50" fontFamily="monospace">
        ✍️ 방명록 작성
      </Heading>
      <VStack spacing={4}>
        <Flex gap={3} width="100%">
          <Input
            name="commentNickname"
            placeholder="귀여운 닉네임"
            value={guestbookData && guestbookData.commentNickname}
            onChange={handleInputChange}
            borderColor="#E2E8F0"
            _focus={{ borderColor: '#F7DC6F', boxShadow: '0 0 0 1px #F7DC6F' }}
            color="#4A5568"
            size="sm"
          />
          <Input
            name="commentPassword"
            type="password"
            placeholder="비밀번호"
            value={guestbookData && guestbookData.commentPassword}
            onChange={handleInputChange}
            borderColor="#E2E8F0"
            _focus={{ borderColor: '#F7DC6F', boxShadow: '0 0 0 1px #F7DC6F' }}
            color="#4A5568"
            size="sm"
          />
        </Flex>
        <Flex gap={3} width="100%">
          <Textarea
            name="commentContent"
            placeholder="방명록을 입력해주세요..."
            value={guestbookData && guestbookData.commentContent}
            onChange={handleInputChange}
            borderColor="#E2E8F0"
            _focus={{ borderColor: '#F7DC6F', boxShadow: '0 0 0 1px #F7DC6F' }}
            color="#4A5568"
            resize="vertical"
            minH="100px"
            maxH="200px"
            size="sm"
          />
          <Button
            onClick={handleCommentSubmit}
            colorScheme="yellow"
            bg="#F7DC6F"
            color="#4A5568"
            _hover={{ bg: '#F4D03F' }}
            px={4}
            height="auto"
            alignSelf="flex-end"
            size="sm"
          >
            <ArrowUpIcon />
          </Button>
        </Flex>
      </VStack>
    </Box>
  );

  return (
    <SubTemplate pageTitle={"방명록"} titleQuery={"방명록"}>
      <Skeleton
        isLoaded={isLoaded}
        fadeDuration={1}
        startColor="#F8F9FA"
        endColor="#E2E8F0"
        borderRadius="lg"
      >
        <VStack spacing={8} align="stretch">
          <CommentList />
          <CommentForm />
        </VStack>
      </Skeleton>
    </SubTemplate>
  );
};

export default GuestBook;
