import { AddIcon, ArrowForwardIcon, CalendarIcon, ChatIcon, CloseIcon, DeleteIcon, EditIcon, ExternalLinkIcon, StarIcon, TimeIcon, TriangleUpIcon, ViewIcon } from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    SimpleGrid,
    Skeleton,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrlV2 } from '../Constants/Constants';
import SubTemplate from '../Templates/SubTemplate';

const AdminPage = () => {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isTagsLoaded, setIsTagsLoaded] = useState(false);
    const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
    const [selectedTag, setSelectedTag] = useState('all');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isCategoryOpen, onOpen: onCategoryOpen, onClose: onCategoryClose } = useDisclosure();
    const [newTag, setNewTag] = useState({ tagName: '', description: '', color: '#3498DB' });
    const [newCategory, setNewCategory] = useState({
        categoryName: '',
        categoryDescription: '',
        categoryColor: '#3498DB',
        categoryPath: ''
    });

    useEffect(() => {
        loadPosts();
        loadTags();
        loadCategories();
    }, []);

    // 태그 필터링 적용
    useEffect(() => {
        if (selectedTag === 'all') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post => post.tag === parseInt(selectedTag));
            setFilteredPosts(filtered);
        }
    }, [selectedTag, posts]);

    const loadPosts = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/posts`);
            setPosts(response.data.content);
            setFilteredPosts(response.data.content);
            setIsLoaded(true);
        } catch (error) {
            console.error('게시글 로드 실패:', error);
            toast({
                title: "게시글 로드 실패",
                status: "error",
                isClosable: true,
            });
        }
    };

    const loadTags = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/tags`);
            setTags(response.data);
            setIsTagsLoaded(true);
        } catch (error) {
            console.error('태그 로드 실패:', error);
            // 태그 API가 없을 경우 기본 태그 사용
            setTags([
                { id: 1, name: "생각글", description: "생각과 고민을 나누는 글", color: "#3498DB", postCount: 0 },
                { id: 2, name: "일상만화", description: "만화와 그림 관련 글", color: "#E74C3C", postCount: 0 },
                { id: 3, name: "마크다운", description: "마크다운 파일", color: "#9B59B6", postCount: 0 },
                { id: 4, name: "파일", description: "다양한 파일들", color: "#95A5A6", postCount: 0 },
                { id: 5, name: "플레이리스트", description: "음악 플레이리스트", color: "#F39C12", postCount: 0 }
            ]);
            setIsTagsLoaded(true);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/categories`);
            setCategories(response.data);
            setIsCategoriesLoaded(true);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
            // 카테고리 API가 없을 경우 기본 카테고리 사용
            setCategories([
                { id: 1, categoryName: "생각글", categoryDescription: "생각과 고민을 나누는 글", categoryColor: "#3498DB", categoryPath: "/writes", icon: "💭" },
                { id: 2, categoryName: "일상만화", categoryDescription: "만화와 그림 관련 글", categoryColor: "#E74C3C", categoryPath: "/toons", icon: "🎨" },
                { id: 3, categoryName: "마크다운", categoryDescription: "마크다운 파일", categoryColor: "#9B59B6", categoryPath: "/lists", icon: "📁" },
                { id: 4, categoryName: "파일", categoryDescription: "다양한 파일들", categoryColor: "#95A5A6", categoryPath: "/files", icon: "📄" },
                { id: 5, categoryName: "플레이리스트", categoryDescription: "음악 플레이리스트", categoryColor: "#F39C12", categoryPath: "/playlists", icon: "🎵" }
            ]);
            setIsCategoriesLoaded(true);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${serverUrlV2}/posts/${postId}`);
                toast({
                    title: "게시글 삭제 완료",
                    status: "success",
                    isClosable: true,
                });
                loadPosts();
            } catch (error) {
                console.error('게시글 삭제 실패:', error);
                toast({
                    title: "게시글 삭제 실패",
                    status: "error",
                    isClosable: true,
                });
            }
        }
    };

    const handleEdit = (post) => {
        navigate(`/admin/update/${post.id}`);
    };

    const handleView = (post) => {
        navigate(`/post/${post.id}`);
    };

    const handleCreateTag = async () => {
        try {
            const response = await axios.post(`${serverUrlV2}/tags`, newTag);
            toast({
                title: "태그 생성 완료",
                status: "success",
                isClosable: true,
            });
            setNewTag({ tagName: '', description: '', color: '#3498DB' });
            onClose();
            loadTags();
        } catch (error) {
            console.error('태그 생성 실패:', error);
            toast({
                title: "태그 생성 실패",
                status: "error",
                isClosable: true,
            });
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (window.confirm('이 태그를 삭제하시겠습니까? 관련된 게시글들의 태그가 초기화됩니다.')) {
            try {
                await axios.delete(`${serverUrlV2}/tags/${tagId}`);
                toast({
                    title: "태그 삭제 완료",
                    status: "success",
                    isClosable: true,
                });
                loadTags();
            } catch (error) {
                console.error('태그 삭제 실패:', error);
                toast({
                    title: "태그 삭제 실패",
                    status: "error",
                    isClosable: true,
                });
            }
        }
    };

    const handleCreateCategory = async () => {
        try {
            const response = await axios.post(`${serverUrlV2}/categories`, newCategory);
            toast({
                title: "카테고리 생성 완료",
                status: "success",
                isClosable: true,
            });
            setNewCategory({
                categoryName: '',
                categoryDescription: '',
                categoryColor: '#3498DB',
                categoryPath: ''
            });
            onCategoryClose();
            loadCategories();
            console.log(response.data);
        } catch (error) {
            console.error('카테고리 생성 실패:', error);
            toast({
                title: "카테고리 생성 실패",
                status: "error",
                isClosable: true,
            });
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('이 카테고리를 삭제하시겠습니까? 관련된 게시글들의 카테고리가 초기화됩니다.')) {
            try {
                await axios.delete(`${serverUrlV2}/categories/${categoryId}`);
                toast({
                    title: "카테고리 삭제 완료",
                    status: "success",
                    isClosable: true,
                });
                loadCategories();
            } catch (error) {
                console.error('카테고리 삭제 실패:', error);
                toast({
                    title: "카테고리 삭제 실패",
                    status: "error",
                    isClosable: true,
                });
            }
        }
    };

    const getTagName = (tag) => {
        const tagNames = {
            1: '생각글',
            2: '일상만화',
            3: '마크다운',
            4: '파일',
            5: '플레이리스트'
        };
        return tagNames[tag] || '기타';
    };

    const getTagColor = (tag) => {
        const colors = {
            1: 'blue',
            2: 'red',
            3: 'purple',
            4: 'gray',
            5: 'orange'
        };
        return colors[tag] || 'gray';
    };

    const getTagPostCount = (tagId) => {
        return posts.filter(post => post.tag === tagId).length;
    };

    const getCategoryName = (category) => {
        const categoryNames = {
            1: '생각글',
            2: '일상만화',
            3: '마크다운',
            4: '파일',
            5: '플레이리스트'
        };
        return categoryNames[category] || '기타';
    };

    const getCategoryColor = (category) => {
        const colors = {
            1: 'blue',
            2: 'red',
            3: 'purple',
            4: 'gray',
            5: 'orange'
        };
        return colors[category] || 'gray';
    };

    const getCategoryPostCount = (categoryId) => {
        return posts.filter(post => post.category === categoryId).length;
    };

    const getSelectedTagStats = () => {
        if (selectedTag === 'all') {
            return {
                totalViews: filteredPosts.reduce((sum, post) => sum + (post.views || 0), 0),
                totalLikes: filteredPosts.reduce((sum, post) => sum + (post.likes || 0), 0),
                totalComments: filteredPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0)
            };
        } else {
            return {
                totalViews: filteredPosts.reduce((sum, post) => sum + (post.views || 0), 0),
                totalLikes: filteredPosts.reduce((sum, post) => sum + (post.likes || 0), 0),
                totalComments: filteredPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0)
            };
        }
    };

    const getRecentPosts = () => {
        return posts
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 5);
    };

    const getMostViewedPosts = () => {
        return posts
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
    };

    const getMostLikedPosts = () => {
        return posts
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, 5);
    };

    const getTagDistribution = () => {
        const distribution = {};
        posts.forEach(post => {
            const tagName = getTagName(post.tag);
            distribution[tagName] = (distribution[tagName] || 0) + 1;
        });
        return distribution;
    };

    const getCategoryDistribution = () => {
        const distribution = {};
        posts.forEach(post => {
            const categoryName = getCategoryName(post.category);
            distribution[categoryName] = (distribution[categoryName] || 0) + 1;
        });
        return distribution;
    };

    const getMonthlyStats = () => {
        const now = new Date();
        const thisMonth = posts.filter(post => {
            const postDate = new Date(post.createdDate);
            return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        });

        const lastMonth = posts.filter(post => {
            const postDate = new Date(post.createdDate);
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return postDate.getMonth() === lastMonthDate.getMonth() && postDate.getFullYear() === lastMonthDate.getFullYear();
        });

        return {
            thisMonth: thisMonth.length,
            lastMonth: lastMonth.length,
            change: thisMonth.length - lastMonth.length
        };
    };

    const monthlyStats = getMonthlyStats();
    const tagDistribution = getTagDistribution();
    const categoryDistribution = getCategoryDistribution();

    const StatsCard = ({ title, value, icon, color }) => (
        <Box
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor="#E2E8F0"
            boxShadow="sm"
            textAlign="center"
        >
            <Text fontSize="2xl" mb={2}>{icon}</Text>
            <Heading size="md" color="#2C3E50" mb={2}>{value}</Heading>
            <Text color="#6B7280" fontSize="sm">{title}</Text>
        </Box>
    );

    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0);
    const selectedStats = getSelectedTagStats();

    return (
        <SubTemplate pageTitle="어드민 페이지" titleQuery="관리">
            <Skeleton
                isLoaded={isLoaded}
                fadeDuration={1}
                startColor="#F8F9FA"
                endColor="#E2E8F0"
                borderRadius="lg"
            >
                <Tabs variant="enclosed" colorScheme="yellow">
                    <TabList>
                        <Tab>📊 대시보드</Tab>
                        <Tab>📋 게시글 관리</Tab>
                        <Tab>🏷️ 태그 관리</Tab>
                        <Tab>📚 카테고리 관리</Tab>
                    </TabList>

                    <TabPanels>
                        {/* 대시보드 탭 */}
                        <TabPanel>
                            <VStack spacing={8} align="stretch">
                                {/* 대시보드 섹션 */}
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
                                        📊 대시보드
                                    </Heading>

                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                                        <StatsCard title="전체 게시글" value={posts.length} icon="📝" color="blue" />
                                        <StatsCard title="총 조회수" value={totalViews} icon="👁️" color="green" />
                                        <StatsCard title="총 좋아요" value={totalLikes} icon="❤️" color="red" />
                                        <StatsCard title="총 댓글" value={totalComments} icon="💬" color="purple" />
                                    </SimpleGrid>

                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                        {/* 월간 통계 */}
                                        <Box
                                            bg="#F8F9FA"
                                            p={4}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="#E2E8F0"
                                        >
                                            <Flex align="center" mb={3}>
                                                <CalendarIcon color="#2C3E50" mr={2} />
                                                <Text fontWeight="medium" color="#2C3E50">이번 달 통계</Text>
                                            </Flex>
                                            <VStack spacing={2} align="start">
                                                <HStack justify="space-between" w="100%">
                                                    <Text fontSize="sm" color="#6B7280">이번 달 게시글</Text>
                                                    <Text fontWeight="bold">{monthlyStats.thisMonth}개</Text>
                                                </HStack>
                                                <HStack justify="space-between" w="100%">
                                                    <Text fontSize="sm" color="#6B7280">지난 달 게시글</Text>
                                                    <Text fontWeight="bold">{monthlyStats.lastMonth}개</Text>
                                                </HStack>
                                                <HStack justify="space-between" w="100%">
                                                    <Text fontSize="sm" color="#6B7280">변화</Text>
                                                    <Text fontWeight="bold" color={monthlyStats.change >= 0 ? "green.500" : "red.500"}>
                                                        {monthlyStats.change >= 0 ? "+" : ""}{monthlyStats.change}개
                                                    </Text>
                                                </HStack>
                                            </VStack>
                                        </Box>

                                        {/* 태그 분포 */}
                                        <Box
                                            bg="#F8F9FA"
                                            p={4}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="#E2E8F0"
                                        >
                                            <Flex align="center" mb={3}>
                                                <StarIcon color="#2C3E50" mr={2} />
                                                <Text fontWeight="medium" color="#2C3E50">태그 분포</Text>
                                            </Flex>
                                            <VStack spacing={2} align="start">
                                                {Object.entries(tagDistribution).map(([tagName, count]) => (
                                                    <HStack justify="space-between" w="100%" key={tagName}>
                                                        <Text fontSize="sm" color="#6B7280">{tagName}</Text>
                                                        <Text fontWeight="bold">{count}개</Text>
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </SimpleGrid>

                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        {/* 최근 게시글 */}
                                        <Box
                                            bg="#F8F9FA"
                                            p={4}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="#E2E8F0"
                                        >
                                            <Flex align="center" mb={3}>
                                                <TimeIcon color="#2C3E50" mr={2} />
                                                <Text fontWeight="medium" color="#2C3E50">최근 게시글</Text>
                                            </Flex>
                                            <VStack spacing={2} align="start">
                                                {getRecentPosts().map((post) => (
                                                    <Box key={post.id} w="100%" p={2} bg="white" borderRadius="sm">
                                                        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                            {post.contentTitle}
                                                        </Text>
                                                        <Text fontSize="xs" color="#6B7280">
                                                            {new Date(post.createdDate).toLocaleDateString()}
                                                        </Text>
                                                    </Box>
                                                ))}
                                            </VStack>
                                        </Box>

                                        {/* 인기 게시글 */}
                                        <Box
                                            bg="#F8F9FA"
                                            p={4}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="#E2E8F0"
                                        >
                                            <Flex align="center" mb={3}>
                                                <TriangleUpIcon color="#2C3E50" mr={2} />
                                                <Text fontWeight="medium" color="#2C3E50">인기 게시글</Text>
                                            </Flex>
                                            <VStack spacing={2} align="start">
                                                {getMostViewedPosts().map((post) => (
                                                    <Box key={post.id} w="100%" p={2} bg="white" borderRadius="sm">
                                                        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                            {post.contentTitle}
                                                        </Text>
                                                        <HStack spacing={2}>
                                                            <Text fontSize="xs" color="#6B7280">
                                                                👁️ {post.views || 0}
                                                            </Text>
                                                            <Text fontSize="xs" color="#6B7280">
                                                                ❤️ {post.likes || 0}
                                                            </Text>
                                                        </HStack>
                                                    </Box>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </SimpleGrid>
                                </Box>
                            </VStack>
                        </TabPanel>

                        {/* 게시글 관리 탭 */}
                        <TabPanel>
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
                                                leftIcon={<CloseIcon />}
                                                onClick={() => setSelectedTag('all')}
                                            >
                                                필터 해제
                                            </Button>
                                        )}
                                    </Flex>
                                    <Flex gap={4} wrap="wrap">
                                        <StatsCard title="총 게시글" value={filteredPosts.length} icon="📝" color="blue" />
                                        <StatsCard title="총 조회수" value={selectedStats.totalViews} icon="👁️" color="green" />
                                        <StatsCard title="총 좋아요" value={selectedStats.totalLikes} icon="❤️" color="red" />
                                        <StatsCard title="총 댓글" value={selectedStats.totalComments} icon="💬" color="purple" />
                                    </Flex>
                                </Box>

                                {/* 게시글 관리 */}
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
                                            📋 게시글 관리 {selectedTag !== 'all' && `(${getTagName(parseInt(selectedTag))})`}
                                        </Heading>
                                        <HStack spacing={2}>
                                            <Select
                                                value={selectedTag}
                                                onChange={(e) => setSelectedTag(e.target.value)}
                                                size="sm"
                                                width="200px"
                                            >
                                                <option value="all">전체 게시글</option>
                                                {tags.map((tag) => (
                                                    <option key={tag.id} value={tag.id}>
                                                        {tag.name} ({getTagPostCount(tag.id)})
                                                    </option>
                                                ))}
                                            </Select>
                                            <Button
                                                colorScheme="blue"
                                                leftIcon={<ArrowForwardIcon />}
                                                onClick={() => navigate('/admin/upload')}
                                            >
                                                새 게시글 작성
                                            </Button>
                                        </HStack>
                                    </Flex>

                                    <Box overflowX="auto">
                                        <Table variant="simple" size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th>제목</Th>
                                                    <Th>카테고리</Th>
                                                    <Th>조회수</Th>
                                                    <Th>좋아요</Th>
                                                    <Th>댓글</Th>
                                                    <Th>작성일</Th>
                                                    <Th>최근 수정일</Th>
                                                    <Th>관리</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {filteredPosts.map((post) => (
                                                    <Tr key={post.id}>
                                                        <Td>
                                                            <Text fontWeight="medium" noOfLines={1}>
                                                                {post.contentTitle}
                                                            </Text>
                                                        </Td>
                                                        <Td>
                                                            <Badge colorScheme={getTagColor(post.tag)}>
                                                                {getTagName(post.tag)}
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <HStack spacing={1}>
                                                                <ViewIcon />
                                                                <Text>{post.views || 0}</Text>
                                                            </HStack>
                                                        </Td>
                                                        <Td>
                                                            <HStack spacing={1}>
                                                                <Text color="red.500">❤️</Text>
                                                                <Text>{post.likes || 0}</Text>
                                                            </HStack>
                                                        </Td>
                                                        <Td>
                                                            <HStack spacing={1}>
                                                                <ChatIcon />
                                                                <Text>{post.commentCount || 0}</Text>
                                                            </HStack>
                                                        </Td>
                                                        <Td>
                                                            <VStack spacing={0} align="start">
                                                                <Text fontSize="xs" color="#6B7280">
                                                                    {new Date(post.createdDate).toLocaleDateString()}
                                                                </Text>
                                                                <Text fontSize="xs" color="#6B7280">
                                                                    {new Date(post.createdDate).toLocaleTimeString()}
                                                                </Text>
                                                            </VStack>
                                                        </Td>
                                                        <Td>
                                                            <VStack spacing={0} align="start">
                                                                <Text fontSize="xs" color="#6B7280">
                                                                    {new Date(post.modifiedDate).toLocaleDateString()}
                                                                </Text>
                                                                <Text fontSize="xs" color="#6B7280">
                                                                    {new Date(post.modifiedDate).toLocaleTimeString()}
                                                                </Text>
                                                            </VStack>
                                                        </Td>
                                                        <Td>
                                                            <HStack spacing={2}>
                                                                <Button
                                                                    size="sm"
                                                                    colorScheme="green"
                                                                    variant="ghost"
                                                                    onClick={() => handleView(post)}
                                                                    title="게시글 보기"
                                                                >
                                                                    <ExternalLinkIcon />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    colorScheme="blue"
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
                                </Box>
                            </VStack>
                        </TabPanel>

                        {/* 태그 관리 탭 */}
                        <TabPanel>
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
                                            colorScheme="green"
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
                                                            <Td onClick={() => setSelectedTag(tag.id.toString())}>
                                                                <Text fontWeight="medium">
                                                                    {tag.tagName}
                                                                </Text>
                                                            </Td>
                                                            <Td onClick={() => setSelectedTag(tag.id.toString())}>
                                                                <Text fontSize="sm" color="#6B7280">
                                                                    {tag.tagDescription}
                                                                </Text>
                                                            </Td>
                                                            <Td onClick={() => setSelectedTag(tag.id.toString())}>
                                                                <Text>{getTagPostCount(tag.id)}</Text>
                                                            </Td>
                                                            <Td onClick={() => setSelectedTag(tag.id.toString())}>
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
                            </VStack>
                        </TabPanel>

                        {/* 카테고리 관리 탭 */}
                        <TabPanel>
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
                                            onClick={onCategoryOpen}
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
                                                        <Th>관리</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {categories.map((category) => (
                                                        <Tr key={category.id} cursor="pointer" _hover={{ bg: '#F8F9FA' }}>
                                                            <Td onClick={() => { /* 카테고리 선택 로직 추가 */ }}>
                                                                <Text fontWeight="medium">
                                                                    {category.categoryName}
                                                                </Text>
                                                            </Td>
                                                            <Td onClick={() => { /* 카테고리 선택 로직 추가 */ }}>
                                                                <Text fontSize="sm" color="#6B7280">
                                                                    {category.categoryDescription}
                                                                </Text>
                                                            </Td>
                                                            <Td onClick={() => { /* 카테고리 선택 로직 추가 */ }}>
                                                                <Text>{getCategoryPostCount(category.id)}</Text>
                                                            </Td>
                                                            <Td onClick={() => { /* 카테고리 선택 로직 추가 */ }}>
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
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Skeleton>

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
                        <Button colorScheme="blue" mr={3} onClick={handleCreateTag}>
                            생성
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            취소
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* 카테고리 생성 모달 */}
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
                        <Button colorScheme="blue" mr={3} onClick={handleCreateCategory}>
                            생성
                        </Button>
                        <Button variant="ghost" onClick={onCategoryClose}>
                            취소
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SubTemplate>
    );
};

export default AdminPage; 