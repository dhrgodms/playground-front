import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Table,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';

const CategoryManagement = ({ categories, posts, isCategoriesLoaded, handleCreateCategory, handleDeleteCategory }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newCategory, setNewCategory] = useState({
        categoryName: '',
        categoryDescription: '',
        categoryColor: '#3498DB',
        categoryPath: ''
    });

    const getCategoryPostCount = (categoryId) => {
        return posts.filter(post => post.category === categoryId).length;
    };

    const handleSubmit = () => {
        handleCreateCategory(newCategory);
        setNewCategory({
            categoryName: '',
            categoryDescription: '',
            categoryColor: '#3498DB',
            categoryPath: ''
        });
        onClose();
    };

    return (
        <VStack spacing={8} align="stretch">
            <Box
                bg="white"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="#E2E8F0"
                boxShadow="sm"
                position="relative"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '3px',
                    bg: '#2C3E50',
                    borderRadius: 'lg lg 0 0'
                }}
            >
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md" color="#2C3E50" fontFamily="monospace">
                        📚 카테고리 관리
                    </Heading>
                    <Button
                        colorScheme="blue"
                        leftIcon={<AddIcon />}
                        onClick={onOpen}
                    >
                        새 카테고리 생성
                    </Button>
                </Flex>

                <Skeleton isLoaded={isCategoriesLoaded}>
                    <Box overflowX="auto">
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>카테고리명</Th>
                                    <Th>설명</Th>
                                    <Th>게시글 수</Th>
                                    <Th>색상</Th>
                                    <Th>경로</Th>
                                    <Th>관리</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {categories.map((category) => (
                                    <Tr key={category.id} cursor="pointer" _hover={{ bg: '#F8F9FA' }}>
                                        <Td>
                                            <Text fontWeight="medium">
                                                {category.categoryName}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text fontSize="sm" color="#6B7280">
                                                {category.categoryDescription}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>{getCategoryPostCount(category.id)}</Text>
                                        </Td>
                                        <Td>
                                            <Box
                                                w="20px"
                                                h="20px"
                                                borderRadius="full"
                                                bg={category.categoryColor}
                                                border="1px solid"
                                                borderColor="#E2E8F0"
                                            />
                                        </Td>
                                        <Td>
                                            <Text fontSize="sm" color="#6B7280">
                                                {category.categoryPath}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Button
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => handleDeleteCategory(category.id)}
                                                title="카테고리 삭제"
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Skeleton>
            </Box>

            {/* 카테고리 생성 모달 */}
            <Modal isOpen={isOpen} onClose={onClose}>
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
                            <FormControl isRequired>
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
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            생성
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            취소
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default CategoryManagement; 