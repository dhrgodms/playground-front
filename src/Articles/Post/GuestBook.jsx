import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
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
import { ArrowUpIcon } from "@chakra-ui/icons";
import SubTemplate from "../../Templates/SubTemplate";
import serverUrl from "../../Constants/Constants";

/**
 * TODO: 비밀번호 검증
 * TODO: 수정/삭제 가능하도록
 * @returns
 */
const GuestBook = () => {
  const [guestbook, setguestbook] = useState([]);
  const [guestbookData, setGuestbookData] = useState({
    commentContent: "",
    commentNickname: "",
    commentPassword: "",
  });
  const toast = useToast();

  useEffect(() => {
    guestbook?.length < 2 &&
      axios
        .get(`${serverUrl}:8080/api/guestbook/all`)
        .then((response) => setguestbook(response.data))
        .catch((error) => console.log(error));
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setGuestbookData({ ...guestbookData, [name]: value });
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    try {
      axios
        .post(`${serverUrl}:8080/api/guestbook/add`, {
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
          setguestbook([...guestbook, res.data]);
          if (res?.data) {
            toast({
              title: `방명록 업로드 완료.`,
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

  //   async function handleModify(e) {
  //     e.preventDefault();
  //     try {
  //       axios
  //         .post(`${serverUrl}:8080/api/guestbook/modify/${id}`, {
  //           memberName: guestbookData.commentNickname,
  //           memberPassword: guestbookData.commentPassword,
  //           content: guestbookData.commentContent,
  //         })
  //         .then((res) => {
  //           console.log("res:", res);
  //           setGuestbookData({
  //             commentContent: "",
  //             commentNickname: "",
  //             commentPassword: "",
  //           });
  //           setguestbook([...guestbook, res.data]);
  //           if (res?.data) {
  //             toast({
  //               title: `방명록 업로드 완료.`,
  //               status: "success",
  //               isClosable: true,
  //             });
  //           } else {
  //             toast({
  //               title: `잉ㅠ실패`,
  //               status: "error",
  //               isClosable: true,
  //             });
  //           }
  //         });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  const CommentList = () => {
    return guestbook?.map((comment, index) => (
      <Card key={comment.id}>
        <CardBody>
          <Heading size={"xs"}>{comment.memberName}</Heading>
          <Stack divider={<StackDivider />} spacing="2">
            <Flex direction={"column"} key={index}>
              <Text pt="1" fontSize="md">
                {comment.content}
              </Text>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    ));
  };

  //   function EditableControls({ isEditing, onSubmit, onCancel, onEdit }) {
  //     return isEditing ? (
  //       <ButtonGroup justifyContent="center" size="sm">
  //         <IconButton
  //           icon={<CheckIcon />}
  //           onClick={onSubmit}
  //           aria-label={"submit"}
  //         />
  //         <IconButton
  //           icon={<CloseIcon />}
  //           onClick={onCancel}
  //           aria-label={"close"}
  //         />
  //       </ButtonGroup>
  //     ) : (
  //       <Flex justifyContent="center">
  //         <IconButton
  //           size="sm"
  //           icon={<EditIcon />}
  //           onClick={onEdit}
  //           aria-label={"edit"}
  //         />
  //       </Flex>
  //     );
  //   }

  return (
    <SubTemplate pageTitle={"~방명록~"} titleQuery={"방명록"}>
      <Flex height={"100vh"} style={{ flexDirection: "column" }}>
        <VStack height={"100vh"} style={{ flexDirection: "column" }}>
          <VStack width={"75vw"} p={"5"} alignItems={"stretch"}>
            <CommentList />

            <Flex>
              <Input
                name="commentNickname"
                placeholder={"귀여운 닉네임"}
                value={guestbookData && guestbookData.commentNickname}
                onChange={handleInputChange}
              />
              <Input
                name="commentPassword"
                placeholder={"비밀번호 486"}
                value={guestbookData && guestbookData.commentPassword}
                onChange={handleInputChange}
              />
            </Flex>
            <Flex>
              <Textarea
                name="commentContent"
                placeholder={"내용을 입력해주세요."}
                value={guestbookData && guestbookData.commentContent}
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
      </Flex>
    </SubTemplate>
  );
};

export default GuestBook;
