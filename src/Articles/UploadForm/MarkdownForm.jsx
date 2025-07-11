import React, { useCallback, useRef, useState, useEffect } from "react";
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
export default function MarkdownForm({ tag, postValue }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: 1,
    content_title: postValue ? postValue.contentTitle : "",
    content: postValue ? postValue.content : "내용!",
    thumbnail: postValue ? postValue.thumbnail : "",
    // tag : 1=글, 2=그림, 3=MD파일
    tag: 3
  });

  // postValue가 변경될 때 formData 업데이트
  useEffect(() => {
    if (postValue) {
      setFormData({
        user_id: 1,
        content_title: postValue.contentTitle || "",
        content: postValue.content || "내용!",
        thumbnail: postValue.thumbnail || "",
        tag: 3
      });
    }
  }, [postValue]);
  const [value, setValue] = React.useState(postValue ? "**로딩 중...**" : "**Hello world!!!**");

  // 기존 MD 파일 내용을 가져오는 useEffect
  useEffect(() => {
    if (postValue && postValue.fileUrls && postValue.fileUrls.length > 0) {
      const fetchMarkdownContent = async () => {
        try {
          // MD 파일 찾기
          const mdFile = postValue.fileUrls.find(url =>
            url.toLowerCase().endsWith('.md') || url.toLowerCase().endsWith('.markdown')
          );

          if (mdFile) {
            const response = await fetch(mdFile);
            const text = await response.text();
            setValue(text);
          }
        } catch (error) {
          console.error("MD 파일을 불러오는데 실패했습니다:", error);
          setValue("**파일을 불러올 수 없습니다.**");
        }
      };

      fetchMarkdownContent();
    }
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

      // 4. 게시글 등록 또는 수정
      if (postValue && postValue.id) {
        // 수정 모드
        const res = await axios.put(`${serverUrlV2}/posts/${postValue.id}`, {
          id: postValue.id,
          contentTitle: formData.content_title,
          content: fileUrl,
          thumbnail: formData.thumbnail,
          tag: 3, // MD 파일 태그
          fileUrls: [fileUrl],
        });

        if (res?.data) {
          toast({
            title: `수정 완료`,
            status: "success",
            isClosable: true,
          });
          // 수정 후 해당 게시글 페이지로 이동
          setTimeout(() => {
            navigate(`/post/${postValue.id}`);
          }, 1000);
        } else {
          toast({
            title: `수정 실패`,
            status: "error",
            isClosable: true,
          });
        }
      } else {
        // 새 게시글 작성 모드
        const res = await axios.post(`${serverUrlV2}/posts`, {
          contentTitle: formData.content_title,
          content: fileUrl,
          thumbnail: formData.thumbnail,
          tag: 3, // MD 파일 태그
          fileUrls: [fileUrl],
        });

        if (res?.data) {
          toast({
            title: `업로드 완료`,
            status: "success",
            isClosable: true,
          });
          navigate("/");
        } else {
          toast({
            title: `업로드 실패`,
            status: "error",
            isClosable: true,
          });
        }
      }

      setFormData({
        user_id: "",
        content_title: "",
        content: "",
        thumbnail: "",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: `오류가 발생했습니다`,
        status: "error",
        isClosable: true,
      });
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
              value={formData.content_title}
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
            {postValue && postValue.id ? "수정" : "업로드"} <ArrowUpIcon />
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
