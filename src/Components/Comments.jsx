import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import serverUrl from "../Constants/Constants";
import React, { useState } from "react";
import { ArrowUpIcon } from "@chakra-ui/icons";

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
    <Card>
      <CardHeader pb={"0"}>
        <Heading size="sm">Comments</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="2">
          {commentAll?.map((comment, index) => (
            <Flex direction={"column"} key={index}>
              <Heading size="xs" textTransform="uppercase">
                {comment.memberName}
              </Heading>
              <Text pt="1" fontSize="xs">
                {comment.content}
              </Text>
            </Flex>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );

  async function handleCommentSubmit(e) {
    e.preventDefault();

    try {
      axios
        .post(`${serverUrl}:8080/api/comment/add`, {
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
              title: `댓글 업로드 완료됐나벼`,
              status: "success",
              isClosable: true,
            });
          } else {
            toast({
              title: `잉ㅠ실패`,
              status: "error",
              isClosable: true,
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <VStack height={"100vh"} style={{ flexDirection: "column" }}>
      <VStack width={"75vw"} p={"5"} alignItems={"stretch"}>
        <CommentList />
        <Flex>
          <Input
            name="commentNickname"
            placeholder={"귀여운 닉네임"}
            value={commentData && commentData.commentNickname}
            onChange={handleInputChange}
          />
          <Input
            name="commentPassword"
            placeholder={"비밀번호 486"}
            value={commentData && commentData.commentPassword}
            onChange={handleInputChange}
          />
        </Flex>
        <Flex>
          <Textarea
            name="commentContent"
            placeholder={"댓글을 입력해주세요."}
            value={commentData && commentData.commentContent}
            onChange={handleInputChange}
          />
          <IconButton
            icon={<ArrowUpIcon />}
            type={"submit"}
            onClick={handleCommentSubmit}
            aria-label={"commentSubmit"}
          />
        </Flex>
      </VStack>
    </VStack>
  );
}
