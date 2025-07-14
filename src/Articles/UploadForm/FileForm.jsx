import { AddIcon, ArrowUpIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbnailUpload from "../../Atoms/ThumbnailUpload";
import { serverUrlV2 } from "../../Constants/Constants";

export const FileForm = ({ tag, redirectTo, postValue }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: 1,
    content_title: postValue ? postValue.contentTitle : "",
    content: postValue ? postValue.content : "내용!",
    thumbnail: postValue ? postValue.thumbnail : "",
    category: postValue ? postValue.category : 4, // 기본값: 파일
    tag: postValue ? postValue.tag : 4, // 기본값: 파일
    likes: 0,
    views: 0,
  });
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 모달 상태
  const { isOpen: isCategoryOpen, onOpen: onCategoryOpen, onClose: onCategoryClose } = useDisclosure();
  const { isOpen: isTagOpen, onOpen: onTagOpen, onClose: onTagClose } = useDisclosure();

  // 새 카테고리/태그 상태
  const [newCategory, setNewCategory] = useState({ categoryName: '', categoryDescription: '', categoryColor: '#3498DB', categoryPath: '' });
  const [newTag, setNewTag] = useState({ tagName: '', tagDescription: '', tagColor: '#3498DB' });

  // 카테고리 목록 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get(`${serverUrlV2}/categories`);
        setCategories(response.data);
        // 기본 카테고리 설정 (파일 카테고리)
        const fileCategory = response.data.find(c => c.id === 4) || response.data[0];
        setSelectedCategory(fileCategory);
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
        // 기본 카테고리 설정
        const defaultCategories = [
          { id: 1, name: "생각글", description: "생각과 고민을 나누는 글", color: "#3498DB" },
          { id: 2, name: "일상만화", description: "만화와 그림 관련 글", color: "#E74C3C" },
          { id: 3, name: "마크다운", description: "마크다운 파일", color: "#9B59B6" },
          { id: 4, name: "파일", description: "다양한 파일들", color: "#95A5A6" },
          { id: 5, name: "플레이리스트", description: "음악 플레이리스트", color: "#F39C12" }
        ];
        setCategories(defaultCategories);
        setSelectedCategory(defaultCategories[3]); // 파일 카테고리
      }
    };
    loadCategories();
  }, []);

  // 태그 목록 로드
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await axios.get(`${serverUrlV2}/tags`);
        setTags(response.data);
      } catch (error) {
        console.error('태그 로드 실패:', error);
        // 기본 태그 설정
        setTags([
          { id: 1, name: "생각글", description: "생각과 고민을 나누는 글", color: "#3498DB" },
          { id: 2, name: "일상만화", description: "만화와 그림 관련 글", color: "#E74C3C" },
          { id: 3, name: "마크다운", description: "마크다운 파일", color: "#9B59B6" },
          { id: 4, name: "파일", description: "다양한 파일들", color: "#95A5A6" },
          { id: 5, name: "플레이리스트", description: "음악 플레이리스트", color: "#F39C12" }
        ]);
      }
    };
    loadTags();
  }, []);

  // Update formData when postValue changes
  React.useEffect(() => {
    if (postValue) {
      setFormData({
        user_id: 1,
        content_title: postValue.contentTitle || "",
        content: postValue.content || "내용!",
        thumbnail: postValue.thumbnail || "",
        category: postValue.category || 4,
        tag: postValue.tag || 4,
        likes: 0,
        views: 0,
      });
    }
  }, [postValue]);

  // 카테고리 선택
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // 태그 선택/해제
  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.find(t => t.id === tag.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  // 필터링된 태그 목록
  const filteredTags = tags.filter(tag =>
    tag.tagName.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
    tag.tagDescription.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  // 새 카테고리 생성
  const handleCreateCategory = async () => {
    try {
      const response = await axios.post(`${serverUrlV2}/categories`, newCategory);
      toast({
        title: "카테고리 생성 완료",
        status: "success",
        isClosable: true,
      });
      const newCategoryData = response.data;
      setCategories(prev => [...prev, newCategoryData]);
      setSelectedCategory(newCategoryData);
      setNewCategory({ categoryName: '', categoryDescription: '', categoryColor: '#3498DB', categoryPath: '' });
      onCategoryClose();
    } catch (error) {
      console.error('카테고리 생성 실패:', error);
      toast({
        title: "카테고리 생성 실패",
        status: "error",
        isClosable: true,
      });
    }
  };

  // 새 태그 생성
  const handleCreateTag = async () => {
    try {
      const response = await axios.post(`${serverUrlV2}/tags`, newTag);
      toast({
        title: "태그 생성 완료",
        status: "success",
        isClosable: true,
      });
      setTags(prev => [...prev, response.data]);
      setNewTag({ name: '', description: '', color: '#3498DB' });
      onTagClose();
    } catch (error) {
      console.error('태그 생성 실패:', error);
      toast({
        title: "태그 생성 실패",
        status: "error",
        isClosable: true,
      });
    }
  };

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

    // For new posts, require at least one file
    if (!postValue && fileList.length === 0) {
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
      let s3Urls = [];

      // Only upload new files if there are any
      if (fileList.length > 0) {
        // 1. 파일별 presigned URL 받아 S3에 직접 업로드
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
      } else if (postValue && postValue.fileUrls) {
        // For updates, keep existing files if no new files are added
        s3Urls = postValue.fileUrls;
      }

      const postData = {
        userId: formData.user_id,
        contentTitle: formData.content_title,
        content: formData.content,
        thumbnail: formData.thumbnail,
        category: selectedCategory?.id || 4,
        tags: selectedTags.map(t => t.id),
        fileUrls: s3Urls
      };

      if (postValue?.id) {
        // Update mode
        await axios.put(`${serverUrlV2}/posts/${postValue.id}`, postData);
        toast({
          title: "수정 완료!",
          status: "success",
          isClosable: true,
        });
        // If redirectTo is provided, use it, otherwise go to post
        navigate(redirectTo || `/post/${postValue.id}`);
      } else {
        // Create mode
        await axios.post(`${serverUrlV2}/posts`, postData);
        setFormData({
          user_id: "",
          content_title: "",
          content: "",
          thumbnail: "",
          category: 4,
          tag: 4,
        });
        setFileList([]);
        setSelectedCategory(categories.find(c => c.id === 4) || categories[0]);
        setSelectedTags([]);
        toast({
          title: "업로드 완료!",
          status: "success",
          isClosable: true,
        });
        // If redirectTo is provided, use it, otherwise go to admin
        navigate(redirectTo || "/admin");
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      toast({
        title: "업로드 실패!",
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        {/* 제목 입력 */}
        <FormControl isRequired>
          <FormLabel>제목</FormLabel>
          <Input
            name="content_title"
            value={formData.content_title}
            onChange={handleInputChange}
            placeholder="제목을 입력하세요"
          />
        </FormControl>

        {/* 카테고리 선택 */}
        <FormControl isRequired>
          <FormLabel>카테고리</FormLabel>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">선택된 카테고리:</Text>
              <Button size="sm" leftIcon={<AddIcon />} onClick={onCategoryOpen}>
                새 카테고리
              </Button>
            </HStack>

            {/* 카테고리 선택 버튼 */}
            <Button
              variant="outline"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              rightIcon={isCategoryDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              justifyContent="space-between"
              w="full"
            >
              {selectedCategory ? (
                <HStack spacing={2}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="full"
                    bg={selectedCategory.color || selectedCategory.categoryColor || "#3498DB"}
                    border="1px"
                    borderColor="white"
                  />
                  <Text>{selectedCategory.name || selectedCategory.categoryName}</Text>
                </HStack>
              ) : (
                <Text color="gray.500">카테고리를 선택하세요</Text>
              )}
            </Button>

            {/* 카테고리 드롭다운 */}
            {isCategoryDropdownOpen && (
              <Box
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
                maxH="200px"
                overflowY="auto"
                boxShadow="lg"
                zIndex={10}
              >
                <VStack spacing={0} align="stretch">
                  {categories.length === 0 ? (
                    <Text p={3} color="gray.500" fontSize="sm">카테고리를 불러오는 중...</Text>
                  ) : (
                    categories.map((category) => {
                      console.log('카테고리 렌더링:', category);
                      return (
                        <Box
                          key={category.id}
                          p={3}
                          cursor="pointer"
                          onClick={() => {
                            handleCategoryChange(category);
                            setIsCategoryDropdownOpen(false);
                          }}
                          bg={selectedCategory?.id === category.id ? "blue.50" : "white"}
                          _hover={{ bg: selectedCategory?.id === category.id ? "blue.100" : "gray.50" }}
                          borderBottom="1px"
                          borderColor="gray.100"
                          _last={{ borderBottom: "none" }}
                        >
                          <HStack justify="space-between" align="center">
                            <HStack spacing={3} align="center">
                              {/* 색상 원형 */}
                              <Box
                                w={4}
                                h={4}
                                borderRadius="full"
                                bg={category.color || category.categoryColor || "#3498DB"}
                                border="2px"
                                borderColor="white"
                                boxShadow="sm"
                              />
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium" fontSize="sm">
                                  {category.name || category.categoryName || '이름 없음'}
                                </Text>
                                {(category.description || category.categoryDescription) && (
                                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                    {category.description || category.categoryDescription}
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                            {selectedCategory?.id === category.id && (
                              <Icon as={CheckIcon} color="blue.500" />
                            )}
                          </HStack>
                        </Box>
                      );
                    })
                  )}
                </VStack>
              </Box>
            )}
          </VStack>
        </FormControl>

        {/* 태그 선택 */}
        <FormControl>
          <FormLabel>태그</FormLabel>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">선택된 태그:</Text>
              <Button size="sm" leftIcon={<AddIcon />} onClick={onTagOpen}>
                새 태그
              </Button>
            </HStack>

            {/* 선택된 태그 표시 */}
            {selectedTags.length > 0 && (
              <Wrap>
                {selectedTags.map((tag) => (
                  <WrapItem key={tag.id}>
                    <Badge
                      bg={tag.tagColor || "#3498DB"}
                      color="white"
                      variant="solid"
                      cursor="pointer"
                      onClick={() => toggleTag(tag)}
                      _hover={{ opacity: 0.8 }}
                    >
                      {tag.tagName || tag.name} ×
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            )}

            {/* 태그 검색 */}
            <Input
              placeholder="태그 검색..."
              value={tagSearchTerm}
              onChange={(e) => setTagSearchTerm(e.target.value)}
              size="sm"
            />

            {/* 태그 목록 */}
            <Wrap spacing={2}>
              {filteredTags.map((tag) => {
                const isSelected = selectedTags.find(t => t.id === tag.id);
                return (
                  <WrapItem key={tag.id}>
                    <Badge
                      bg={isSelected ? (tag.tagColor || "#3498DB") : "gray.300"}
                      color={isSelected ? "white" : "gray.700"}
                      variant="solid"
                      cursor="pointer"
                      onClick={() => toggleTag(tag)}
                      _hover={{
                        bg: isSelected ? (tag.tagColor || "#3498DB") : "gray.400",
                        opacity: isSelected ? 0.8 : 1
                      }}
                    >
                      {tag.tagName || tag.name}
                    </Badge>
                  </WrapItem>
                );
              })}
            </Wrap>
          </VStack>
        </FormControl>

        {/* 썸네일 업로드 */}
        <ThumbnailUpload
          value={formData.thumbnail}
          onChange={handleThumbnailChange}
        />

        {/* 파일 업로드 */}
        <FormControl>
          <FormLabel>파일 업로드</FormLabel>
          <VStack spacing={3} align="stretch">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="*/*"
            />

            {/* 업로드된 파일 목록 */}
            {fileList.length > 0 && (
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" fontWeight="medium">선택된 파일:</Text>
                {fileList.map((file, index) => (
                  <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" noOfLines={1}>
                      {file.name}
                    </Text>
                    <IconButton
                      size="sm"
                      icon={<CloseIcon />}
                      onClick={() => removeFile(index)}
                      variant="ghost"
                      colorScheme="red"
                    />
                  </HStack>
                ))}
              </VStack>
            )}
          </VStack>
        </FormControl>

        {/* 업로드 진행률 */}
        {isUploading && (
          <Box>
            <Text fontSize="sm" mb={2}>파일 업로드 중...</Text>
            <Progress value={uploadProgress} colorScheme="blue" />
          </Box>
        )}

        {/* 제출 버튼 */}
        <Button
          type="submit"
          colorScheme="blue"
          leftIcon={<ArrowUpIcon />}
          size="lg"
          isLoading={isUploading}
          loadingText="업로드 중..."
        >
          {postValue?.id ? "수정하기" : "업로드하기"}
        </Button>
      </VStack>

      {/* 새 카테고리 생성 모달 */}
      <Modal isOpen={isCategoryOpen} onClose={onCategoryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>새 카테고리 생성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>카테고리명</FormLabel>
                <Input
                  value={newCategory.categoryName}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                  placeholder="카테고리명을 입력하세요"
                />
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  value={newCategory.categoryDescription}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryDescription: e.target.value })}
                  placeholder="카테고리에 대한 설명을 입력하세요"
                />
              </FormControl>
              <FormControl>
                <FormLabel>색상</FormLabel>
                <Input
                  type="color"
                  value={newCategory.categoryColor}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryColor: e.target.value || '#3498DB' })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>경로</FormLabel>
                <Input
                  value={newCategory.categoryPath}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryPath: e.target.value })}
                  placeholder="카테고리 경로 (예: /category-name)"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateCategory}>
              생성
            </Button>
            <Button variant="ghost" onClick={onCategoryClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 새 태그 생성 모달 */}
      <Modal isOpen={isTagOpen} onClose={onTagClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>새 태그 생성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>태그명</FormLabel>
                <Input
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="태그명을 입력하세요"
                />
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  placeholder="태그에 대한 설명을 입력하세요"
                />
              </FormControl>
              <FormControl>
                <FormLabel>색상</FormLabel>
                <Input
                  type="color"
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCreateTag}>
              생성
            </Button>
            <Button variant="ghost" onClick={onTagClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
