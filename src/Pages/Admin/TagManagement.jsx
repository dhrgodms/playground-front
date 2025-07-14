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

const TagManagement = ({ tags, posts, isTagsLoaded, handleCreateTag, handleDeleteTag }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newTag, setNewTag] = useState({ tagName: '', tagDescription: '', tagColor: '#3498DB' });

    const getTagPostCount = (tagId) => {
        return posts.filter(post => post.tag === tagId).length;
    };

    const handleSubmit = () => {
        handleCreateTag(newTag);
        setNewTag({ tagName: '', tagDescription: '', tagColor: '#3498DB' });
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
                        🏷️ 태그 관리
                    </Heading>
                    <Button
                        colorScheme="blue"
                        leftIcon={<AddIcon />}
                        onClick={onOpen}
                    >
                        새 태그 생성
                    </Button>
                </Flex>

                <Skeleton isLoaded={isTagsLoaded}>
                    <Box overflowX="auto">
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>태그명</Th>
                                    <Th>설명</Th>
                                    <Th>게시글 수</Th>
                                    <Th>색상</Th>
                                    <Th>관리</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tags.map((tag) => (
                                    <Tr key={tag.id} cursor="pointer" _hover={{ bg: '#F8F9FA' }}>
                                        <Td>
                                            <Text fontWeight="medium">
                                                {tag.tagName}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text fontSize="sm" color="#6B7280">
                                                {tag.tagDescription}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text>{getTagPostCount(tag.id)}</Text>
                                        </Td>
                                        <Td>
                                            <Box
                                                w="20px"
                                                h="20px"
                                                borderRadius="full"
                                                bg={tag.tagColor}
                                                border="1px solid"
                                                borderColor="#E2E8F0"
                                            />
                                        </Td>
                                        <Td>
                                            <Button
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => handleDeleteTag(tag.id)}
                                                title="태그 삭제"
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

            {/* 태그 생성 모달 */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>새 태그 생성</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>태그명</FormLabel>
                                <Input
                                    value={newTag.tagName}
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
                                    onChange={(e) => setNewTag({ ...newTag, tagColor: e.target.value })}
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

export default TagManagement; 