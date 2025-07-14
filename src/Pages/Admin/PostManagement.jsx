import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Select,
    Skeleton,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';
import React from 'react';

const PostManagement = ({
    posts,
    filteredPosts,
    tags,
    selectedTag,
    setSelectedTag,
    isLoaded,
    handleDelete,
    handleEdit,
    handleView
}) => {
    const getTagName = (tag) => {
        const foundTag = tags.find(t => t.id === tag);
        return foundTag ? foundTag.name : '알 수 없음';
    };

    const getTagColor = (tag) => {
        const foundTag = tags.find(t => t.id === tag);
        return foundTag ? foundTag.color : '#95A5A6';
    };

    const getSelectedTagStats = () => {
        if (selectedTag === 'all') {
            return {
                total: posts.length,
                views: posts.reduce((sum, post) => sum + (post.views || 0), 0),
                likes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
                comments: posts.reduce((sum, post) => sum + (post.commentCount || 0), 0)
            };
        } else {
            const filtered = posts.filter(post => post.tag === parseInt(selectedTag));
            return {
                total: filtered.length,
                views: filtered.reduce((sum, post) => sum + (post.views || 0), 0),
                likes: filtered.reduce((sum, post) => sum + (post.likes || 0), 0),
                comments: filtered.reduce((sum, post) => sum + (post.commentCount || 0), 0)
            };
        }
    };

    const selectedStats = getSelectedTagStats();

    return (
        <VStack spacing={8} align="stretch">
            {/* 통계 카드 */}
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
                        📊 {selectedTag === 'all' ? '전체 통계' : `${getTagName(parseInt(selectedTag))} 통계`}
                    </Heading>
                    {selectedTag !== 'all' && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTag('all')}
                        >
                            전체 보기
                        </Button>
                    )}
                </Flex>

                <HStack spacing={6} mb={6}>
                    <Box textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="#3498DB">{selectedStats.total}</Text>
                        <Text fontSize="sm" color="#6B7280">게시글</Text>
                    </Box>
                    <Box textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="#27AE60">{selectedStats.views}</Text>
                        <Text fontSize="sm" color="#6B7280">조회수</Text>
                    </Box>
                    <Box textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="#E74C3C">{selectedStats.likes}</Text>
                        <Text fontSize="sm" color="#6B7280">좋아요</Text>
                    </Box>
                    <Box textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="#9B59B6">{selectedStats.comments}</Text>
                        <Text fontSize="sm" color="#6B7280">댓글</Text>
                    </Box>
                </HStack>

                {/* 태그 필터 */}
                <Box mb={6}>
                    <Text fontSize="sm" fontWeight="medium" color="#2C3E50" mb={2}>
                        태그별 필터
                    </Text>
                    <Select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        size="sm"
                        maxW="200px"
                    >
                        <option value="all">전체</option>
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </Select>
                </Box>
            </Box>

            {/* 게시글 목록 */}
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
                <Heading size="md" color="#2C3E50" fontFamily="monospace" mb={6}>
                    📋 게시글 목록
                </Heading>

                <Skeleton isLoaded={isLoaded}>
                    <Box overflowX="auto">
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>제목</Th>
                                    <Th>태그</Th>
                                    <Th>조회수</Th>
                                    <Th>좋아요</Th>
                                    <Th>댓글</Th>
                                    <Th>작성일</Th>
                                    <Th>관리</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredPosts.map((post) => (
                                    <Tr key={post.id} cursor="pointer" _hover={{ bg: '#F8F9FA' }}>
                                        <Td onClick={() => handleView(post)}>
                                            <Text fontWeight="medium" noOfLines={1}>
                                                {post.contentTitle}
                                            </Text>
                                        </Td>
                                        <Td onClick={() => handleView(post)}>
                                            <Badge
                                                colorScheme="blue"
                                                variant="subtle"
                                                bg={getTagColor(post.tag)}
                                                color="white"
                                                fontSize="xs"
                                            >
                                                {getTagName(post.tag)}
                                            </Badge>
                                        </Td>
                                        <Td onClick={() => handleView(post)}>
                                            <Text fontSize="sm" color="#6B7280">
                                                {post.views || 0}
                                            </Text>
                                        </Td>
                                        <Td onClick={() => handleView(post)}>
                                            <Text fontSize="sm" color="#6B7280">
                                                {post.likes || 0}
                                            </Text>
                                        </Td>
                                        <Td onClick={() => handleView(post)}>
                                            <Text fontSize="sm" color="#6B7280">
                                                {post.commentCount || 0}
                                            </Text>
                                        </Td>
                                        <Td onClick={() => handleView(post)}>
                                            <Text fontSize="sm" color="#6B7280">
                                                {new Date(post.createdDate).toLocaleDateString()}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <Button
                                                    size="sm"
                                                    colorScheme="blue"
                                                    variant="ghost"
                                                    onClick={() => handleView(post)}
                                                    title="게시글 보기"
                                                >
                                                    <ViewIcon />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    colorScheme="green"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(post)}
                                                    title="게시글 수정"
                                                >
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(post.id)}
                                                    title="게시글 삭제"
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Skeleton>
            </Box>
        </VStack>
    );
};

export default PostManagement; 