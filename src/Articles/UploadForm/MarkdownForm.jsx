import { AddIcon, ArrowUpIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbnailUpload from "../../Atoms/ThumbnailUpload";
import { serverUrlV2 } from "../../Constants/Constants";

export default function MarkdownForm({ tag, postValue, redirectTo }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    user_id: 1,
    content_title: postValue ? postValue.contentTitle : "",
    content: postValue ? postValue.content : "내용!",
    thumbnail: postValue ? postValue.thumbnail : "",
    category: postValue ? postValue.category : 1, // 기본값: 생각글
    tag: postValue ? postValue.tag : 1, // 기본값: 생각글
  });

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
        console.log('카테고리 로드 성공:', response.data);
        console.log('카테고리 데이터 구조:', response.data[0]);
        setCategories(response.data);
        // 기본 카테고리 설정
        if (response.data.length > 0) {
          console.log('기본 카테고리 설정:', response.data[0]);
          setSelectedCategory(response.data[0]);
        }
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
        console.log('기본 카테고리 사용:', defaultCategories);
        setCategories(defaultCategories);
        setSelectedCategory(defaultCategories[0]);
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

  // postValue가 변경될 때 formData 업데이트
  useEffect(() => {
    if (postValue) {
      setFormData({
        user_id: 1,
        content_title: postValue.contentTitle || "",
        content: postValue.content || "내용!",
        thumbnail: postValue.thumbnail || "",
        category: postValue.category || 1,
        tag: postValue.tag || 1,
      });
    }
  }, [postValue]);

  // MD 에디터 상태 관리
  const [value, setValue] = useState(postValue ? postValue.content : "내용!");

  // 기존 content 내용을 가져오는 useEffect
  useEffect(() => {
    if (postValue && postValue.content) {
      setValue(postValue.content);
    }
  }, [postValue]);

  // 카테고리 선택
  const handleCategoryChange = (category) => {
    console.log('카테고리 선택됨:', category);
    setSelectedCategory(category);
  };

  // 태그 선택/해제
  const toggleTag = (tag) => {
    console.log('태그 토글:', tag);
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
      setNewTag({ tagName: '', description: '', color: '#3498DB' });
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

  const handleThumbnailChange = (thumbnailUrl) => {
    setFormData({ ...formData, thumbnail: thumbnailUrl });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // MD 파일이 아닌 경우 content 필드에 마크다운 내용 저장
      const postData = {
        userId: formData.user_id,
        contentTitle: formData.content_title,
        content: value, // MD 에디터의 내용을 content에 저장
        thumbnail: formData.thumbnail,
        category: selectedCategory?.id || 1,
        tags: selectedTags.map(t => t.id)
      };

      if (postValue?.id) {
        // 수정 모드
        await axios.put(`${serverUrlV2}/posts/${postValue.id}`, postData);
        toast({
          title: "수정 완료!",
          status: "success",
          isClosable: true,
        });
        // If redirectTo is provided, use it, otherwise go to post
        navigate(redirectTo || `/post/${postValue.id}`);
      } else {
        // 생성 모드
        await axios.post(`${serverUrlV2}/posts`, postData);
        setFormData({
          user_id: "",
          content_title: "",
          content: "",
          thumbnail: "",
          category: 1,
          tag: 1,
        });
        setValue("내용!");
        setSelectedCategory(categories[0]);
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
    }
  }

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

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
                      bg={isSelected ? (tag.tagColor || tag.color || "#3498DB") : "gray.300"}
                      color={isSelected ? "white" : "gray.700"}
                      variant="solid"
                      cursor="pointer"
                      onClick={() => toggleTag(tag)}
                      _hover={{
                        bg: isSelected ? (tag.tagColor || tag.color || "#3498DB") : "gray.400",
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

        {/* 마크다운 에디터 */}
        <FormControl isRequired>
          <FormLabel>내용</FormLabel>
          <Box data-color-mode="light">
            <MDEditor
              value={value}
              onChange={setValue}
              height={400}
              preview="edit"
            />
          </Box>
        </FormControl>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          colorScheme="blue"
          leftIcon={<ArrowUpIcon />}
          size="lg"
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
                  onChange={(e) => setNewCategory({ ...newCategory, categoryColor: e.target.value })}
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
                  onChange={(e) => setNewTag({ ...newTag, tagName: e.target.value })}
                  placeholder="태그명을 입력하세요"
                />
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  value={newTag.tagDescription}
                  onChange={(e) => setNewTag({ ...newTag, tagDescription: e.target.value })}
                  placeholder="태그에 대한 설명을 입력하세요"
                />
              </FormControl>
              <FormControl>
                <FormLabel>색상</FormLabel>
                <Input
                  type="color"
                  value={newTag.tagColor}
                  onChange={(e) => setNewTag({ ...newTag, tagColor: e.target.value || '#3498DB' })}
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
}