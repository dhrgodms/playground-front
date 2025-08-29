import { CalendarIcon, StarIcon, TimeIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react';
import React from 'react';

const StatsCard = ({ title, value, icon, color }) => (
    <Box
        bg="white"
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor="#E2E8F0"
        boxShadow="sm"
        textAlign="center"
        position="relative"
        _before={{
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            bg: color === 'blue' ? '#3498DB' : color === 'green' ? '#27AE60' : color === 'red' ? '#E74C3C' : '#9B59B6',
            borderRadius: 'lg lg 0 0'
        }}
    >
        <Text fontSize="2xl" mb={2}>{icon}</Text>
        <Text fontSize="2xl" fontWeight="bold" color="#2C3E50">{value}</Text>
        <Text fontSize="sm" color="#6B7280">{title}</Text>
    </Box>
);

const Dashboard = ({ posts, tags, categories }) => {
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0);

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

    const getTagDistribution = () => {
        const distribution = {};
        posts.forEach(post => {
            const tag = tags.find(t => t.id === post.tag);
            if (tag) {
                distribution[tag.name] = (distribution[tag.name] || 0) + 1;
            }
        });
        return distribution;
    };

    const getMonthlyStats = () => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const thisMonthPosts = posts.filter(post => {
            const postDate = new Date(post.createdDate);
            return postDate.getMonth() === thisMonth && postDate.getFullYear() === thisYear;
        }).length;

        const lastMonthPosts = posts.filter(post => {
            const postDate = new Date(post.createdDate);
            const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
            const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
            return postDate.getMonth() === lastMonth && postDate.getFullYear() === lastYear;
        }).length;

        return {
            thisMonth: thisMonthPosts,
            lastMonth: lastMonthPosts,
            change: thisMonthPosts - lastMonthPosts
        };
    };

    const monthlyStats = getMonthlyStats();
    const tagDistribution = getTagDistribution();

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
    );
};

export default Dashboard; 