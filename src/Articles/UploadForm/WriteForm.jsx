import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl, serverUrlV2 } from "../../Constants/Constants";
export const WriteForm = ({ tag, postValue }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: 1,
    content_title: postValue ? postValue.contentTitle : "",
    content: postValue ? postValue.content : "",
    thumbnail: postValue
      ? postValue.thumbnail
      : `${serverUrl}:8080/thumbnail/white.JPG`,
    // tag : 1=글, 2=그림, 3=플레이리스트
    tag: postValue ? postValue.tag : "",
    likes: postValue ? postValue.likes : "",
    views: postValue ? postValue.views : "",
  });
  const [value, setValue] = React.useState(
    postValue ? postValue.content : "**Hello world!!!**"
  );

  useEffect(() => {
    !postValue?.id < 2 && setValue(postValue?.content);
  }, [postValue]);
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
        .post(`${serverUrl}/api/post/thumbnail-upload`, formImageData, {
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

    return (
      <FormControl>
        <Flex gap={"3"} align={"center"}>
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
          >
            +Thumbnail
          </Button>
          <Input
            focusBorderColor="green"
            size={"sm"}
            colorScheme={"green"}
            varient="filled"
            isReadOnly={true}
            value={postValue && postValue.thumbnail}
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
        .post(`${serverUrlV2}/posts`, {
          userId: formData.user_id,
          contentTitle: formData.content_title,
          content: formData.content,
          thumbnail: formData.thumbnail,
          // tag : 1=글, 2=그림, 3=플레이리스트 4=file
          tag: tag
        })
        .then((res) => {
          setFormData({
            user_id: "",
            content_title: "",
            content: "",
            thumbnail: "",
          });
          if (res?.data) {
            toast({
              title: `업로드 됐나바`,
              status: "success",
              isClosable: true,
            });
            navigate("/");
          } else {
            toast({
              title: `업실`,
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
    <Box my={4} textAlign="left">
      <form
        onSubmit={handleSubmit}
        style={{ flexDirection: "column", gap: "10px" }}
      >
        <Flex direction={"column"} justify={"center"} gap={"5"}>
          <FormControl isRequired>
            <FormLabel>Content Title</FormLabel>
            <Input
              focusBorderColor={"green"}
              defaultValue={postValue && postValue.contentTitle}
              onChange={handleInputChange}
              name="content_title"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Content</FormLabel>
            <Textarea
              focusBorderColor="green"
              type="text"
              defaultValue={postValue && postValue.content}
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
          <Button type="sumbit" colorScheme="yellow">
            upload <ArrowUpIcon />
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
