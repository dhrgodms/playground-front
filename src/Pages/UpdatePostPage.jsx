import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileForm } from "../Articles/UploadForm/FileForm";
import MarkdownForm from "../Articles/UploadForm/MarkdownForm";
import { serverUrl, serverUrlV2 } from "../Constants/Constants";
import SubTemplate from "../Templates/SubTemplate";

function Lorem(props) {
  return (
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </Text>
  );
}

function UpdatePostPage() {
  const { id } = useParams();
  const [writePost, setWritePost] = useState({
    id: 1,
    thumbnail: `${serverUrl}/white.jpg`,
    contentTitle: "",
  });
  const toast = useToast();


  const navigate = useNavigate();

  // Check if we came from admin page
  const isFromAdmin = window.location.pathname.includes('/admin/update');

  // 1. id가 바뀔 때만 게시글 fetch
  useEffect(() => {
    if (id) {
      axios
        .get(`${serverUrlV2}/posts/${id}`)
        .then((response) => {
          setWritePost(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [id]);



  function onDeletePost() {
    axios
      .delete(`${serverUrlV2}/posts/${id}`)
      .then((response) => {
        toast({
          title: "게시글 삭제 완료",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        // If we came from admin page, redirect back to admin, otherwise go to writes
        navigate(isFromAdmin ? '/admin' : "/writes");
      })
      .catch((error) => console.log(error));
  }

  function BasicUsage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button
          colorScheme={"red"}
          variant="outline"
          onClick={onOpen}
          leftIcon={<DeleteIcon />}
        >
          삭제
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>정말 삭제하시겠습니까?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</Text>
            </ModalBody>

            <ModalFooter gap={3}>
              <Button variant="ghost" onClick={onClose}>
                취소
              </Button>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => {
                  onDeletePost();
                  onClose();
                }}
              >
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // Determine which form component to use based on post tag
  const renderFormComponent = () => {
    const tag = writePost.tag || 1;

    if (tag === 4) {
      // File posts - use FileForm
      return (
        <FileForm
          tag={tag}
          postValue={writePost}
          redirectTo={isFromAdmin ? '/admin' : undefined}
        />
      );
    } else {
      // All other posts (글, 그림, 마크다운) - use MarkdownForm
      return (
        <MarkdownForm
          tag={tag}
          postValue={writePost}
          redirectTo={isFromAdmin ? '/admin' : undefined}
        />
      );
    }
  };

  return (
    <SubTemplate
      pageTitle={writePost.contentTitle + "   (EDITING)"}
      titleQuery={writePost.contentTitle}
    >
      <Box>
        {renderFormComponent()}
        <Flex justify="center" mt={6}>
          <BasicUsage />
        </Flex>
      </Box>
    </SubTemplate>
  );
}

export default UpdatePostPage;
