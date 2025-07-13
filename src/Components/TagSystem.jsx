import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
    Badge,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    HStack,
    Text,
    VStack,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import React, { useState } from "react";

const TagSystem = ({
    tags,
    selectedTags,
    onTagSelect,
    onTagDeselect,
    showCount = true,
    maxDisplay = 5
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("#E2E8F0", "gray.600");
    const textColor = useColorModeValue("#4A5568", "gray.200");
    const selectedBg = useColorModeValue("#F7DC6F", "#F4D03F");
    const selectedText = useColorModeValue("#2C3E50", "gray.800");

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            onTagDeselect(tag);
        } else {
            onTagSelect(tag);
        }
    };

    const displayedTags = isExpanded ? tags : tags.slice(0, maxDisplay);
    const hasMoreTags = tags.length > maxDisplay;

    const tagColors = {
        "생각글": { bg: "#3498DB", color: "white" },
        "일상만화": { bg: "#E74C3C", color: "white" },
        "마크다운": { bg: "#9B59B6", color: "white" },
        "플레이리스트": { bg: "#F39C12", color: "white" },
        "방명록": { bg: "#1ABC9C", color: "white" },
        "default": { bg: "#95A5A6", color: "white" }
    };

    const getTagColor = (tagName) => {
        return tagColors[tagName] || tagColors.default;
    };

    return (
        <>
            {/* Desktop Tag System */}
            <Box display={{ base: "none", md: "block" }}>
                <VStack spacing={3} align="stretch">
                    <Text fontSize="sm" fontWeight="medium" color={textColor} fontFamily="monospace">
                        📂 카테고리 필터
                    </Text>
                    <Flex wrap="wrap" gap={2}>
                        {displayedTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.name);
                            const tagColor = getTagColor(tag.name);

                            return (
                                <Badge
                                    key={tag.name}
                                    px={3}
                                    py={2}
                                    borderRadius="full"
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    bg={isSelected ? selectedBg : tagColor.bg}
                                    color={isSelected ? selectedText : tagColor.color}
                                    _hover={{
                                        transform: "translateY(-1px)",
                                        boxShadow: "sm"
                                    }}
                                    onClick={() => handleTagClick(tag.name)}
                                    fontFamily="monospace"
                                    fontSize="xs"
                                >
                                    {tag.icon} {tag.name}
                                    {showCount && ` (${tag.count})`}
                                </Badge>
                            );
                        })}
                        {hasMoreTags && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsExpanded(!isExpanded)}
                                rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                color={textColor}
                                fontFamily="monospace"
                                fontSize="xs"
                            >
                                {isExpanded ? "접기" : `+${tags.length - maxDisplay}개 더보기`}
                            </Button>
                        )}
                    </Flex>
                </VStack>
            </Box>

            {/* Mobile Tag System */}
            <Box display={{ base: "block", md: "none" }}>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onOpen}
                    rightIcon={<ChevronDownIcon />}
                    color={textColor}
                    borderColor={borderColor}
                    fontFamily="monospace"
                    fontSize="xs"
                    width="100%"
                >
                    📂 필터 ({selectedTags.length}개 선택됨)
                </Button>

                <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
                    <DrawerOverlay />
                    <Box
                        position="fixed"
                        bottom={0}
                        left={0}
                        right={0}
                        bg={bgColor}
                        borderTop="1px solid"
                        borderColor={borderColor}
                        borderRadius="lg lg 0 0"
                        p={4}
                        maxH="60vh"
                        overflowY="auto"
                    >
                        <DrawerHeader p={0} mb={4}>
                            <Text fontSize="md" fontWeight="medium" color={textColor} fontFamily="monospace">
                                📂 카테고리 필터
                            </Text>
                        </DrawerHeader>

                        <DrawerBody p={0}>
                            <VStack spacing={3} align="stretch">
                                {tags.map((tag) => {
                                    const isSelected = selectedTags.includes(tag.name);
                                    const tagColor = getTagColor(tag.name);

                                    return (
                                        <Flex
                                            key={tag.name}
                                            justify="space-between"
                                            align="center"
                                            p={3}
                                            borderRadius="md"
                                            bg={isSelected ? selectedBg : "transparent"}
                                            border="1px solid"
                                            borderColor={isSelected ? selectedBg : borderColor}
                                            cursor="pointer"
                                            onClick={() => handleTagClick(tag.name)}
                                            transition="all 0.2s"
                                            _hover={{
                                                bg: isSelected ? selectedBg : "gray.50"
                                            }}
                                        >
                                            <HStack spacing={3}>
                                                <Text fontSize="lg">{tag.icon}</Text>
                                                <Text
                                                    fontSize="sm"
                                                    color={isSelected ? selectedText : textColor}
                                                    fontFamily="monospace"
                                                >
                                                    {tag.name}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="xs" color={isSelected ? selectedText : "gray.500"}>
                                                {tag.count}
                                            </Text>
                                        </Flex>
                                    );
                                })}
                            </VStack>
                        </DrawerBody>
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};

export default TagSystem; 