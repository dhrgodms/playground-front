import React, { useCallback, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { serverUrl, serverUrlV2 } from "../../Constants/Constants";
export default function MarkdownForm({ tag }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: 1,
    content_title: "",
    content: "내용!",
    thumbnail: "",
    // tag : 1=글, 2=그림, 3=플레이리스트
    tag: 1
  });
  const [value, setValue] = React.useState("**Hello world!!!**");

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
      // 1. 마크다운을 파일로 변환
      const markdownBlob = new Blob([value], { type: "text/markdown" });
      const markdownFile = new File([markdownBlob], "post.md", { type: "text/markdown" });

      // 2. FormData에 파일로 첨부
      const formDataFile = new FormData();
      formDataFile.append("files", markdownFile);

      // 3. 파일 업로드
      const uploadRes = await axios.post(
        `${serverUrlV2}/files/upload`,
        formDataFile,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const fileUrl = uploadRes.data; // S3 URL

      // 4. 게시글 등록 (content에 S3 URL 저장)
      const res = await axios.post(`${serverUrlV2}/post`, {
        contentTitle: formData.content_title,
        content: fileUrl,
        thumbnail: formData.thumbnail,
        tag: tag,
        fileUrls: fileUrl,
      });

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
              placeholder="..OㅅO.."
              onChange={handleInputChange}
              name="content_title"
              value={formData && formData.content_title}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Content</FormLabel>
            <div className="container" data-color-mode="light">
              <MDEditor value={value} onChange={setValue} height={500} />
            </div>
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
}
