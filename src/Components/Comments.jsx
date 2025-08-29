import { ArrowUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

export default function CommentContainer({
  id,
  commentAll,
  setCommentAll,
  writePost,
}) {
  const [commentData, setCommentData] = useState({
    commentContent: "",
    commentNickname: "",
    commentPassword: "",
    post: "",
  });
  const toast = useToast();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setCommentData({ ...commentData, [name]: value });
  }

  const CommentList = () => (
    <Box
      bg="#F8F9FA"
      p={3}
      borderRadius="md"
      borderWidth="1px"
      borderColor="#E2E8F0"
      color="#4A5568"
      boxShadow="xs"
      position="relative"
      width="100%"
      _before={{
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '2px',
        bg: '#2C3E50',
        borderRadius: 'md md 0 0'
      }}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="sm" color="#2C3E50" fontFamily="monospace" fontWeight="medium">
          💬 Comments ({commentAll?.length || 0})
        </Text>
      </Flex>
      <Stack spacing="2" maxH="200px" overflowY="auto" mb={3}>
        {commentAll?.map((comment, index) => (
          <Box
            key={index}
            p={2}
            border="1px solid"
            borderColor="#E2E8F0"
            borderRadius="sm"
            bg="white"
            width="100%"
          >
            <Flex justify="space-between" align="center" mb={1}>
              <Text fontSize="xs" color="#2C3E50" fontFamily="monospace" fontWeight="medium">
                {comment.memberName}
              </Text>
              <Text fontSize="xs" color="#718096">
                #{index + 1}
              </Text>
            </Flex>
            <Text fontSize="xs" color="#4A5568" whiteSpace="pre-wrap" width="100%">
              {comment.content}
            </Text>
          </Box>
        ))}
        {(!commentAll || commentAll.length === 0) && (
          <Text fontSize="xs" color="#718096" textAlign="center" py={2}>
            첫 번째 댓글을 남겨보세요! 💭
          </Text>
        )}
      </Stack>

      <Box borderTop="1px solid" borderColor="#E2E8F0" pt={3} width="100%">
        <VStack spacing={2} width="100%">
          <Flex gap={2} width="100%">
            <Input
              name="commentNickname"
              placeholder="닉네임"
              value={commentData && commentData.commentNickname}
              onChange={handleInputChange}
              borderColor="#E2E8F0"
              _focus={{ borderColor: '#F7DC6F', boxShadow: '0 0 0 1px #F7DC6F' }}
              color="#4A5568"
              size="xs"
              bg="white"
              flex="1"
            />
            <Input
              name="commentPassword"
              type="password"
              placeholder="비밀번호"
              value={commentData && commentData.commentPassword}
              onChange={handleInputChange}
              borderColor="#E2E8F0"
              _focus={{ borderColor: '#F7DC6F', boxShadow: '0 0 0 1px #F7DC6F' }}
              color="#4A5568"
              size="xs"
              bg="white"
              flex="1"
            />
          </Flex>
          <Flex gap={2} width="100%">
            <Textarea
              name="commentContent"
              placeholder="댓글을 입력해주세요..."
              value={commentData && commentData.commentContent}
              onChange={handleInputChange}
              borderColor="#E2E8F0"
              _focus={{ borderColor: '#F7DC6F', boxShadow: '0 0 0 1px #F7DC6F' }}
              color="#4A5568"
              resize="vertical"
              minH="40px"
              maxH="80px"
              size="xs"
              bg="white"
              flex="1"
            />
            <Button
              onClick={handleCommentSubmit}
              colorScheme="yellow"
              bg="#F7DC6F"
              color="#4A5568"
              _hover={{ bg: '#F4D03F' }}
              px={3}
              height="auto"
              alignSelf="flex-end"
              size="xs"
            >
              <ArrowUpIcon />
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );

  async function handleCommentSubmit(e) {
    e.preventDefault();

    if (!commentData.commentNickname || !commentData.commentPassword || !commentData.commentContent) {
      toast({
        title: "모든 필드를 입력해주세요",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    try {
      axios
        .post(`http://localhost:8080/api/comment/add`, {
          memberName: commentData.commentNickname,
          memberPassword: commentData.commentPassword,
          content: commentData.commentContent,
          post: writePost,
        })
        .then((res) => {
          setCommentData({
            commentContent: "",
            commentNickname: "",
            commentPassword: "",
            post: writePost,
          });
          setCommentAll([...commentAll, res.data]);
          if (res?.data) {
            toast({
              title: `댓글이 등록되었습니다! 💬`,
              status: "success",
              isClosable: true,
            });
          } else {
            toast({
              title: `댓글 등록에 실패했습니다`,
              status: "error",
              isClosable: true,
            });
          }
        });
    } catch (e) {
      console.error(e);
      toast({
        title: "댓글 등록에 실패했습니다",
        status: "error",
        isClosable: true,
      });
    }
  }

  return (
    <VStack spacing={6} width="100%">
      <CommentList />
    </VStack>
  );
}
