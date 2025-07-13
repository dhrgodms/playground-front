import {
    Box,
    Card,
    Flex,
    Heading,
    HStack,
    Image,
    Tag,
    TagLabel,
    TagLeftIcon,
    Text,
    VStack,
} from '@chakra-ui/react';

import { AttachmentIcon, ChatIcon, ViewIcon } from '@chakra-ui/icons';
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const btnRef = React.useRef();
    const handleCardClick = () => {
        navigate(`/post/${post.id}`);
    };

    // 내용을 정해진 글자수로 자르는 함수
    const truncateText = (text, maxLength = 80) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return (
        <Card
            w="36em"
            mx="auto"
            style={{ cursor: 'pointer' }}
            onClick={handleCardClick}
            ref={btnRef}
            mb={2}
            p={4}
            minH="126px"
            bg="white"
            color="#4A5568"
            border="1px solid"
            borderColor="#E2E8F0"
            shadow="sm"
            _hover={{
                transform: "translateY(-1px)",
                shadow: "md",
                borderColor: "#F7DC6F"
            }}
        >
            <Flex direction="row" align="center" gap={4}>
                {/* 썸네일 이미지 */}
                <Box
                    width="162px"
                    height="108px"
                    position="relative"
                    overflow="hidden"
                    flexShrink={0}
                    borderRadius="md"
                    bg="#F8F9FA"
                >
                    <Image
                        src={post.thumbnail}
                        alt="썸네일"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        objectPosition="center"
                    />
                </Box>

                {/* 카드 내용 */}
                <Box flex="1">
                    <Heading size="md" noOfLines={1} mb={2} color="#4A5568">
                        {post.contentTitle}
                    </Heading>
                    <Text noOfLines={2} color="#A0AEC0" fontSize="sm">
                        {truncateText(post.content, 100)}
                    </Text>

                    {/* 파일 첨부 정보 표시 */}
                    {post.fileUrls && post.fileUrls.length > 0 && (
                        <HStack mt={2} spacing={2}>
                            <Tag size="sm" colorScheme="blue" variant="solid" bg="#2C3E50">
                                <TagLeftIcon as={AttachmentIcon} />
                                <TagLabel>{post.fileUrls.length}개 파일</TagLabel>
                            </Tag>
                        </HStack>
                    )}
                </Box>

                {/* 조회수, 좋아요, 댓글 정보 */}
                <Box flexShrink={0}>
                    <VStack spacing={2} align="center">
                        <Tag size="sm" variant="solid" colorScheme="blue" bg="#2C3E50">
                            <TagLeftIcon as={ViewIcon} />
                            <TagLabel>{post.views || 0}</TagLabel>
                        </Tag>
                        <Tag size="sm" variant="solid" colorScheme="cyan" bg="#34495E">
                            <TagLeftIcon as={ChatIcon} />
                            <TagLabel>{post.commentCount || 0}</TagLabel>
                        </Tag>
                        <Tag size="sm" variant="solid" colorScheme="pink" bg="#E74C3C">
                            <TagLeftIcon as={AiFillHeart} />
                            <TagLabel>{post.likes || 0}</TagLabel>
                        </Tag>
                    </VStack>
                </Box>
            </Flex>
        </Card>
    );
};
