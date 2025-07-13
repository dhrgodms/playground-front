import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Skeleton,
    Text,
    VStack
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PostCard } from "../../Components/PostCard";
import TagSystem from '../../Components/TagSystem';
import { serverUrlV2 } from "../../Constants/Constants";
import SubTemplate from "../../Templates/SubTemplate";

const WritePostsList = () => {
    const [writePosts, setWritePosts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    const tagMapping = {
        1: { name: "생각글", icon: "💭", color: "#3498DB" },
        2: { name: "일상만화", icon: "🎨", color: "#E74C3C" },
        3: { name: "마크다운", icon: "📁", color: "#9B59B6" },
        4: { name: "파일", icon: "📄", color: "#95A5A6" },
        5: { name: "플레이리스트", icon: "🎵", color: "#F39C12" },
    };

    const tags = Object.entries(tagMapping).map(([id, info]) => ({
        id: parseInt(id),
        name: info.name,
        icon: info.icon,
        color: info.color,
        count: writePosts.filter(post => post.categoryId === parseInt(id)).length
    }));

    useEffect(() => {
        axios
            .get(`${serverUrlV2}/posts?categoryId=1`)
            .then((response) => {
                const data = response.data.content;
                setWritePosts(data);
                setFilteredPosts(data);
                setIsLoaded(true);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredPosts(writePosts);
        } else {
            const filtered = writePosts.filter(post => {
                const postTag = tagMapping[post.categoryId];
                return postTag && selectedTags.includes(postTag.name);
            });
            setFilteredPosts(filtered);
        }
    }, [selectedTags, writePosts]);

    const handleTagSelect = (tagName) => {
        setSelectedTags(prev => [...prev, tagName]);
    };

    const handleTagDeselect = (tagName) => {
        setSelectedTags(prev => prev.filter(tag => tag !== tagName));
    };

    const FilterSection = () => (
        <Box
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor="#E2E8F0"
            boxShadow="sm"
            mb={6}
        >
            <TagSystem
                tags={tags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                showCount={true}
                maxDisplay={5}
            />
        </Box>
    );

    const ContentSection = () => (
        <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            border="1px solid"
            borderColor="#E2E8F0"
            boxShadow="sm"
            mb={6}
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
                <HStack spacing={3}>
                    <Text fontSize={{ base: "xl", md: "2xl" }}>💭</Text>
                    <Heading size={{ base: "sm", md: "md" }} color="#2C3E50" fontFamily="monospace">
                        생각글 모음 ({filteredPosts.length}개)
                    </Heading>
                </HStack>
                <Button
                    size="sm"
                    colorScheme="yellow"
                    variant="ghost"
                    rightIcon={<ArrowForwardIcon />}
                    onClick={() => window.location.href = '/upload'}
                    _hover={{ bg: '#F7DC6F' }}
                    fontFamily="monospace"
                    fontWeight="medium"
                    display={{ base: "none", sm: "flex" }}
                >
                    글쓰기
                </Button>
            </Flex>

            {filteredPosts.length > 0 ? (
                <VStack spacing={3} align="stretch">
                    {filteredPosts.map(item => (
                        <PostCard key={item.id} post={item} />
                    ))}
                </VStack>
            ) : (
                <Box textAlign="center" py={8}>
                    <Text color="#718096" fontSize="sm">
                        {selectedTags.length > 0 ? "선택한 필터에 맞는 게시글이 없습니다." : "아직 게시글이 없습니다."}
                    </Text>
                </Box>
            )}
        </Box>
    );

    return (
        <SubTemplate pageTitle={"생각글 모음"} titleQuery={"생각글"}>
            <Skeleton
                isLoaded={isLoaded}
                fadeDuration={1}
                startColor="#F8F9FA"
                endColor="#E2E8F0"
                borderRadius="lg"
            >
                <VStack spacing={8} align="stretch">
                    <FilterSection />
                    <ContentSection />
                </VStack>
            </Skeleton>
        </SubTemplate>
    );
};

export default WritePostsList;
