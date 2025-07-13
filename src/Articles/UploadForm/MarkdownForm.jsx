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
  Text,
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

  // 클립보드 이미지 붙여넣기 처리
  const handlePaste = async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();

        let file = item.getAsFile();
        if (file) {
          // 파일명에서 띄어쓰기를 _로 치환
          const safeName = file.name ? file.name.replace(/\s+/g, '_') : 'image.png';
          console.log('원본 파일명:', file.name);
          console.log('변환된 파일명:', safeName);
          file = new File([file], safeName, { type: file.type });
          console.log('새로 생성된 파일명:', file.name);
          try {
            // 이미지 업로드
            const formData = new FormData();
            formData.append('files', file, safeName);

            const response = await axios.post(
              `${serverUrlV2}/files/upload`,
              formData,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            const imageUrl = response.data;
            const imageMarkdown = `![이미지](${imageUrl})`;

            // 현재 커서 위치에 이미지 마크다운 삽입
            const textarea = event.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + imageMarkdown + value.substring(end);
            setValue(newValue);

            toast({
              title: "이미지가 업로드되었습니다",
              status: "success",
              isClosable: true,
            });
          } catch (error) {
            console.error("이미지 업로드 실패:", error);
            toast({
              title: "이미지 업로드에 실패했습니다",
              status: "error",
              isClosable: true,
            });
          }
        }
        break;
      }
    }
  };

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

  // 클립보드 이벤트 리스너 추가
  useEffect(() => {
    console.log('클립보드 이벤트 리스너 등록됨');
    const handleGlobalPaste = async (event) => {
      console.log('paste 이벤트 발생:', event.target);
      const items = event.clipboardData?.items;
      console.log('clipboardData items:', items);
      console.log('items length:', items?.length);
      for (let i = 0; i < items.length; i++) {
        console.log(`item ${i}:`, items[i]);
        console.log(`item ${i} type:`, items[i].type);
        console.log(`item ${i} kind:`, items[i].kind);
      }
      if (!items) return;

      // MD Editor 내부에서만 처리
      const target = event.target;
      console.log('target:', target);
      console.log('closest .w-md-editor:', target.closest('.w-md-editor'));
      if (!target.closest('.w-md-editor')) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log('item type:', item.type);
        if (item.type.indexOf('image') !== -1) {
          console.log('이미지 파일 감지됨!');
          event.preventDefault();

          const file = item.getAsFile();
          console.log('getAsFile() 결과:', file);
          console.log('file name:', file?.name);
          console.log('file size:', file?.size);
          console.log('file type:', file?.type);
          if (file) {
            // 파일명에서 띄어쓰기를 _로 치환
            const safeName = file.name ? file.name.replace(/\s+/g, '_') : 'image.png';
            console.log('원본 파일명:', file.name);
            console.log('변환된 파일명:', safeName);
            const newFile = new File([file], safeName, { type: file.type });
            console.log('새로 생성된 파일명:', newFile.name);
            try {
              // 이미지 업로드
              const formData = new FormData();
              formData.append('files', newFile, safeName);

              const response = await axios.post(
                `${serverUrlV2}/files/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
              );

              const imageUrl = response.data;
              const imageMarkdown = `![이미지](${imageUrl})`;

              // 현재 커서 위치에 이미지 마크다운 삽입
              const textarea = target.closest('.w-md-editor')?.querySelector('textarea');
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const currentValue = value;
                const newValue = currentValue.substring(0, start) + imageMarkdown + currentValue.substring(end);
                setValue(newValue);

                // 커서 위치 업데이트
                setTimeout(() => {
                  textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
                }, 0);
              }

              toast({
                title: "이미지가 업로드되었습니다",
                status: "success",
                isClosable: true,
              });
            } catch (error) {
              console.error("이미지 업로드 실패:", error);
              toast({
                title: "이미지 업로드에 실패했습니다",
                status: "error",
                isClosable: true,
              });
            }
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handleGlobalPaste);

    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [value]);

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
      // MD 내용을 직접 content로 사용
      const markdownContent = value;

      // 4. 게시글 등록 또는 수정
      if (postValue && postValue.id) {
        // 수정 모드
        const res = await axios.put(`${serverUrlV2}/posts/${postValue.id}`, {
          id: postValue.id,
          contentTitle: formData.content_title,
          content: markdownContent,
          thumbnail: formData.thumbnail,
          tag: 3, // MD 파일 태그
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
          content: markdownContent,
          thumbnail: formData.thumbnail,
          tag: 3, // MD 파일 태그
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
            <Text fontSize="sm" color="gray.600" mb={2}>
              💡 팁: 이미지를 복사한 후 Ctrl+V(붙여넣기)를 하면 자동으로 업로드됩니다!
            </Text>
            <div className="container" data-color-mode="light">
              <MDEditor
                value={value}
                onChange={setValue}
                height={500}
              />
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
