import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Input,
  Textarea,
  useToast,
  FormControl,
  Button,
  FormLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowUpIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import SubTemplate from "../Templates/SubTemplate";
import * as PropTypes from "prop-types";
import { ImageForm } from "../Articles/UploadForm/ImageForm";
import MarkdownForm from "../Articles/UploadForm/MarkdownForm";
import { serverUrl, serverUrlV2 } from "../Constants/Constants";
function Lorem(props) {
  return null;
}

Lorem.propTypes = { count: PropTypes.number };

function UpdatePostPage() {
  const { id } = useParams();
  const [writePost, setWritePost] = useState({
    id: 1,
    thumbnail: `${serverUrl}/white.jpg`,
    contentTitle: "",
  });
  const toast = useToast();

  const [formData, setFormData] = useState({
    user_id: 1,
    contentTitle: writePost.contentTitle,
    content: writePost.content,
    thumbnail: writePost.thumbnail,
  });
  const navigate = useNavigate();

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

  // 2. writePost가 바뀔 때만 formData 세팅
  useEffect(() => {
    setFormData({
      user_id: 1,
      contentTitle: writePost.contentTitle,
      content: writePost.content,
      thumbnail: writePost.thumbnail,
    });
  }, [writePost]);


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
        navigate("/writes");
      })
      .catch((error) => console.log(error));
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const SettingUserThumbnail = () => {
    const inputRef = useRef(null);
    const onUploadImage = useCallback((e) => {
      if (!e.target.files) {
        return;
      }

      const formImageData = new FormData();
      formImageData.append("file", e.target.files[0]);

      axios
        .post(`${serverUrl}:8080/api/post/thumbnail-upload`, formImageData, {
          "Content-Type": "multipart/form-data",
        })
        .then((response) => {
          setFormData({ ...formData, thumbnail: response.data });
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

    const onUploadImageButtonClick = useCallback(() => {
      if (!inputRef.current) {
        return;
      }
      inputRef.current.click();
    }, []);

    const onDeleteImage = useCallback((e) => {
      // if (!e.target.files) {
      //     return;
      // }

      axios
        .get(`${serverUrl}:8080/api/post/thumbnail-delete/${id}`, {
          "Content-Type": "multipart/form-data",
        })
        .then((response) => {
          setFormData({
            ...formData,
            thumbnail: `${serverUrl}:8080/thumbnail/white.jpg`,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

    return (
      <FormControl>
        <Flex gap={"2"} align={"center"}>
          <Input
            type="file"
            onChange={onUploadImage}
            accept="image/*"
            ref={inputRef}
            style={{ display: "none" }}
            name="thumbnail"
          />
          <Button
            size={"sm"}
            label="이미지업로드"
            onClick={onUploadImageButtonClick}
            colorScheme={"blue"}
          >
            +
          </Button>
          <Button
            size={"sm"}
            label="이미지업로드"
            onClick={onDeleteImage}
            colorScheme={"red"}
          >
            -
          </Button>
          <Input
            focusBorderColor="green"
            size={"sm"}
            colorScheme={"green"}
            varient="filled"
            isReadOnly={true}
            value={formData.thumbnail}
          />
        </Flex>
        {/*<Button label="이미지 제거" onClick={onDeleteImage} />*/}
      </FormControl>
    );
  };
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      axios
        .put(`${serverUrlV2}/posts/${id}`, {
          id: id,
          contentTitle: formData.contentTitle,
          content: formData.content,
          thumbnail: formData.thumbnail,
          tag: writePost.tag,
        })
        .then((res) => {
          setFormData({
            user_id: "",
            contentTitle: "",
            content: "",
            thumbnail: "",
          });
          if (res?.data) {
            toast({
              title: `수정, 성공적.`,
              status: "success",
              isClosable: true,
            });
            navigate(`/post/${id}`);
          } else {
            toast({
              title: `수정 실패`,
              status: "error",
              isClosable: true,
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  }
  function BasicUsage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button
          colorScheme={"blue"}
          style={{ marginTop: "4.5rem" }}
          onClick={onOpen}
        >
          <DeleteIcon />
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>정말 삭제하시겠습니까?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Lorem count={2} />
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
  return (
    <SubTemplate
      pageTitle={writePost.contentTitle + "   (EDITING)"}
      titleQuery={writePost.contentTitle}
    >
      {console.log(formData)}
      <Tabs variant="soft-rounded" colorScheme="yellow">
        <TabList>
          <Tab>글</Tab>
          <Tab>그림</Tab>
          <Tab>플레이리스트</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box my={4} textAlign="left">
              <form
                onSubmit={handleSubmit}
                style={{ flexDirection: "column", gap: "10px" }}
              >
                <Flex direction={"column"} justify={"center"} gap={"5"}>
                  <FormControl isRequired>
                    <FormLabel>Content Title</FormLabel>
                    <Textarea
                      focusBorderColor="green"
                      type="text"
                      defaultValue={formData && formData.contentTitle}
                      onChange={handleInputChange}
                      name="contentTitle"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      focusBorderColor="green"
                      type="text"
                      defaultValue={formData && formData.content}
                      onChange={handleInputChange}
                      name="content"
                    />
                  </FormControl>
                  <SettingUserThumbnail />
                </Flex>
                <Flex
                  style={{
                    flexDirection: "column",
                    marginTop: "20px",
                    gap: "10px",
                  }}
                >
                  <Button
                    type="sumbit"
                    colorScheme="yellow"
                    variant={"outline"}
                  >
                    SAVE <ArrowUpIcon />
                  </Button>
                  <BasicUsage />
                </Flex>
              </form>
            </Box>
          </TabPanel>
          <TabPanel>
            <ImageForm tag={2} postValue={writePost} />
          </TabPanel>
          <TabPanel>
            <MarkdownForm tag={3} postValue={writePost} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SubTemplate>
  );
}

export default UpdatePostPage;
