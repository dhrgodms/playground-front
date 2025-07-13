import { ArrowUpIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Progress,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbnailUpload from "../../Atoms/ThumbnailUpload";
import { serverUrlV2 } from "../../Constants/Constants";

export const FileForm = ({ categoryId }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: 1,
    content_title: "",
    content: "내용!",
    thumbnail: "",
    categoryId: 1,
    likes: 0,
    views: 0,
  });
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

  const handleThumbnailChange = (thumbnailUrl) => {
    setFormData({ ...formData, thumbnail: thumbnailUrl });
  };

  // presigned URL 요청
  const getPresignedUrl = async (fileName) => {
    const res = await axios.get(`${serverUrlV2}/s3/presigned-url`, {
      params: { fileName }
    });
    return res.data;
  };

  // presigned URL로 S3에 직접 업로드
  const uploadToS3 = async (presignedUrl, file) => {
    try {
      console.log('Uploading to S3:', presignedUrl);
      console.log('File info:', file.name, file.type, file.size);

      const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!response.ok) {
        console.error('S3 upload failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
      }

      console.log('S3 upload successful');
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (fileList.length === 0) {
      toast({
        title: "파일을 선택해주세요.",
        status: "warning",
        isClosable: true,
      });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // 1. 파일별 presigned URL 받아 S3에 직접 업로드
      const s3Urls = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        // presigned URL 요청
        const presignedUrl = await getPresignedUrl(file.name);
        // S3에 직접 업로드
        await uploadToS3(presignedUrl, file);
        // S3 URL 추출
        const s3Url = presignedUrl.split('?')[0];
        s3Urls.push(s3Url);
        setUploadProgress(Math.round(((i + 1) / fileList.length) * 100));
      }
      // 2. 게시글 저장 (fileUrls에 S3 URL 전달)
      const postResponse = await axios.post(`${serverUrlV2}/posts`, {
        userId: formData.user_id,
        contentTitle: formData.content_title,
        content: formData.content,
        thumbnail: formData.thumbnail,
        categoryId: formData.categoryId,
        fileUrls: s3Urls
      });
      setFormData({
        user_id: "",
        content_title: "",
        content: "",
        thumbnail: "",
      });
      setFileList([]);
      setUploadProgress(0);
      toast({
        title: "업로드 완료!",
        status: "success",
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "업로드 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
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
          <FormControl isRequired>
            <FormLabel>Content</FormLabel>
            <Textarea
              focusBorderColor="green"
              type="text"
              placeholder="..OㅅO.."
              onChange={handleInputChange}
              name="content"
              value={formData && formData.content}
            />
          </FormControl>
          <ThumbnailUpload
            value={formData.thumbnail}
            onChange={handleThumbnailChange}
            disabled={isUploading}
          />
          <FormControl>
            <FormLabel>파일 첨부</FormLabel>
            <VStack spacing={3} align="stretch">
              <Input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="*/*"
                disabled={isUploading}
              />
              {fileList.length > 0 && (
                <VStack spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium">
                    선택된 파일 ({fileList.length}개):
                  </Text>
                  {fileList.map((file, index) => (
                    <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                      <Text fontSize="sm" noOfLines={1}>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Text>
                      <IconButton
                        size="sm"
                        icon={<CloseIcon />}
                        onClick={() => removeFile(index)}
                        aria-label="파일 제거"
                        colorScheme="red"
                        variant="ghost"
                        disabled={isUploading}
                      />
                    </HStack>
                  ))}
                </VStack>
              )}
              {isUploading && (
                <Progress value={uploadProgress} size="sm" colorScheme="yellow" mt={2} />
              )}
            </VStack>
          </FormControl>
        </Flex>
        <Flex
          style={{
            flexDirection: "column",
            marginTop: "20px",
            gap: "10px",
          }}
        >
          <Button
            type="submit"
            colorScheme="yellow"
            isLoading={isUploading}
            loadingText="업로드 중..."
            disabled={isUploading}
          >
            upload <ArrowUpIcon />
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
