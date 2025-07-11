import {
    Card,
    CardHeader,
    CardFooter,
    Image,
    Heading,
    Text,
    Button,
    Flex,
    Box,
    HStack,
    Tag,
    TagLabel,
    TagLeftIcon,
} from '@chakra-ui/react';

import { ChatIcon, ExternalLinkIcon, AttachmentIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from 'axios';
import { serverUrlV2 } from '../Constants/Constants';

export const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const btnRef = React.useRef();
    const handleCardClick = () => {
        navigate(`/post/${post.id}`);
    };

    return (
        <Card maxW="md" style={{ cursor: 'pointer' }} onClick={handleCardClick} ref={btnRef}>
            <CardHeader>
                <Flex spacing="4">
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Box>
                            <Heading size="md" noOfLines="1">{post.contentTitle}</Heading>
                            <Text noOfLines="1">{post.content}</Text>
                            {/* 파일 첨부 정보 표시 */}
                            {post.fileUrls && post.fileUrls.length > 0 && (
                                <HStack mt={2} spacing={2}>
                                    <Tag size="sm" colorScheme="blue" variant="subtle">
                                        <TagLeftIcon as={AttachmentIcon} />
                                        <TagLabel>{post.fileUrls.length}개 파일</TagLabel>
                                    </Tag>
                                </HStack>
                            )}
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <Image
                objectFit="cover"
                src={post.thumbnail}
                alt="Chakra UI"
            />

            <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                    '& > button': {
                        minW: '136px',
                    },
                }}
            >
                <Button flex="1" variant="ghost" leftIcon={<ChatIcon />}>
                    Comment
                </Button>
                <Button flex="1" variant="ghost" leftIcon={<ExternalLinkIcon />}>
                    Share
                </Button>
            </CardFooter>
        </Card>
    );
};
