import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    IconButton,
    Skeleton,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import axios from 'axios';
import React, { Children, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageTitle } from "../Atoms/PageTitle";
import { serverUrlV2 } from '../Constants/Constants';

const SubSlider = () => {
    const [mainPostsdata, setMainPostsdata] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/categories`);
            setCategories(response.data);
            setIsCategoriesLoaded(true);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
            // 카테고리 API가 없을 경우 기본 카테고리 사용
            setCategories([
                { id: 1, name: "생각글", description: "생각과 고민을 나누는 글", color: "#3498DB", path: "/writes", icon: "💭" },
                { id: 2, name: "일상만화", description: "만화와 그림 관련 글", color: "#E74C3C", path: "/toons", icon: "🎨" },
                { id: 3, name: "마크다운", description: "마크다운 파일", color: "#9B59B6", path: "/lists", icon: "📁" },
                { id: 4, name: "파일", description: "다양한 파일들", color: "#95A5A6", path: "/files", icon: "📄" },
                { id: 5, name: "플레이리스트", description: "음악 플레이리스트", color: "#F39C12", path: "/playlists", icon: "🎵" }
            ]);
            setIsCategoriesLoaded(true);
        }
    };

    return (
        <>
            <Flex m={"5"} width={"full"} justify={"space-between"}>
                <IconButton
                    ref={btnRef}
                    icon={<HamburgerIcon />}
                    colorScheme="yellow"
                    bg="#F7DC6F"
                    color="#4A5568"
                    onClick={onOpen}
                    aria-label={"hambuger"}
                    _hover={{ bg: '#F4D03F' }}
                />
            </Flex>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay bg="rgba(44, 62, 80, 0.3)" />
                <DrawerContent bg="white" borderRight="2px solid" borderColor="#2C3E50">
                    <DrawerCloseButton color="#2C3E50" />
                    <DrawerHeader bg="#F8F9FA" borderBottom="2px solid" borderColor="#2C3E50">
                        <Heading size={"lg"} mb={3} color="#2C3E50" fontFamily="monospace">🆗 Haeeun.zip
                        </Heading>
                    </DrawerHeader>

                    <DrawerBody bg="white">
                        <Flex direction={"column"} gap={"1.5em"}>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#2C3E50"
                                onClick={() => navigate("/")}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                🏠 메인으로
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#2C3E50"
                                onClick={() => navigate(`/post/${mainPostsdata[0]?.id}`)}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                🔥 인기글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#4A5568"
                                onClick={() => navigate(`/post/${mainPostsdata[1]?.id}`)}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                📝 최신글
                            </Button>

                            <Divider borderColor="#E2E8F0" />

                            <Skeleton isLoaded={isCategoriesLoaded}>
                                <VStack spacing={2} align="stretch">
                                    {categories.map((category) => (
                                        <Button
                                            key={category.id}
                                            ref={btnRef}
                                            colorScheme="yellow"
                                            variant={"ghost"}
                                            bg="#F7DC6F"
                                            color="#4A5568"
                                            onClick={() => navigate(category.categoryPath)}
                                            _hover={{ bg: '#F4D03F' }}
                                            justifyContent="flex-start"
                                        >
                                            {category.categoryIcon || "📁"} {category.categoryName}
                                        </Button>
                                    ))}
                                </VStack>
                            </Skeleton>

                            <Divider borderColor="#E2E8F0" />

                            <Button
                                ref={btnRef}
                                colorScheme="gray"
                                variant={"ghost"}
                                bg="#6B7280"
                                color="white"
                                onClick={() => navigate("/guestbook")}
                                _hover={{ bg: '#4B5563' }}
                            >
                                📮 어서오세요 방명록
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="gray"
                                variant={"ghost"}
                                bg="#6B7280"
                                color="white"
                                onClick={() => navigate("/admin")}
                                _hover={{ bg: '#4B5563' }}
                            >
                                🔧 어드민
                            </Button>
                        </Flex>
                    </DrawerBody>

                    <DrawerFooter bg="#F8F9FA" borderTop="2px solid" borderColor="#2C3E50">
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={onClose}
                            color="#2C3E50"
                            borderColor="#2C3E50"
                            _hover={{ bg: '#2C3E50', color: 'white' }}
                        >
                            close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/categories`);
            setCategories(response.data);
            setIsCategoriesLoaded(true);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
            // 카테고리 API가 없을 경우 기본 카테고리 사용
            setCategories([
                { id: 1, name: "생각글", description: "생각과 고민을 나누는 글", color: "#3498DB", path: "/writes", icon: "💭" },
                { id: 2, name: "일상만화", description: "만화와 그림 관련 글", color: "#E74C3C", path: "/toons", icon: "🎨" },
                { id: 3, name: "마크다운", description: "마크다운 파일", color: "#9B59B6", path: "/lists", icon: "📁" },
                { id: 4, name: "파일", description: "다양한 파일들", color: "#95A5A6", path: "/files", icon: "📄" },
                { id: 5, name: "플레이리스트", description: "음악 플레이리스트", color: "#F39C12", path: "/playlists", icon: "🎵" }
            ]);
            setIsCategoriesLoaded(true);
        }
    };

    const menuItems = [
        { name: "메인으로", path: "/", icon: "🏠" },
        { name: "인기글", path: "/post/1", icon: "🔥" },
        { name: "최신글", path: "/post/2", icon: "📝" },
    ];

    return (
        <Box
            position="fixed"
            left={0}
            top={0}
            h="100vh"
            w={{ base: "100%", lg: "280px" }}
            bg="white"
            borderRight="1px solid"
            borderColor="#E2E8F0"
            overflowY="auto"
            zIndex={10}
            display={{ base: "none", lg: "block" }}
            boxShadow="sm"
        >
            <Box p={{ base: 4, lg: 6 }}>
                <Heading size="lg" mb={6} color="#2C3E50" fontFamily="monospace">
                    🆗 Haeeun.zip
                </Heading>

                <VStack spacing={4} align="stretch">
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            variant="ghost"
                            justifyContent="flex-start"
                            color={location.pathname === item.path ? "#2C3E50" : "#6B7280"}
                            bg={location.pathname === item.path ? "#F7DC6F" : "transparent"}
                            _hover={{ bg: "#F7DC6F" }}
                            onClick={() => navigate(item.path)}
                            fontFamily="monospace"
                        >
                            {item.icon} {item.name}
                        </Button>
                    ))}

                    <Divider borderColor="#E2E8F0" />

                    <Skeleton isLoaded={isCategoriesLoaded}>
                        <VStack spacing={2} align="stretch">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    color={location.pathname === category.path ? "#2C3E50" : "#6B7280"}
                                    bg={location.pathname === category.path ? "#F7DC6F" : "transparent"}
                                    _hover={{ bg: "#F7DC6F" }}
                                    onClick={() => navigate(category.path)}
                                    fontFamily="monospace"
                                >
                                    {category.icon || "📁"} {category.name}
                                </Button>
                            ))}
                        </VStack>
                    </Skeleton>

                    <Divider borderColor="#E2E8F0" />

                    <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        color={location.pathname === "/guestbook" ? "#2C3E50" : "#6B7280"}
                        bg={location.pathname === "/guestbook" ? "#F7DC6F" : "transparent"}
                        _hover={{ bg: "#F7DC6F" }}
                        onClick={() => navigate("/guestbook")}
                        fontFamily="monospace"
                    >
                        📮 어서오세요 방명록
                    </Button>
                    <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        color={location.pathname === "/admin" ? "#2C3E50" : "#6B7280"}
                        bg={location.pathname === "/admin" ? "#F7DC6F" : "transparent"}
                        _hover={{ bg: "#F7DC6F" }}
                        onClick={() => navigate("/admin")}
                        fontFamily="monospace"
                    >
                        🔧 어드민
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

const SubTemplate = ({ children, pageTitle, titleQuery }) => {
    return (
        <>
            <Flex bg="#F5F5F5" minH="100vh" direction={{ base: "column", lg: "row" }}>
                {/* Mobile Menu */}
                <Box display={{ base: "block", lg: "none" }} position="sticky" top={0} zIndex={20}>
                    <SubSlider />
                </Box>

                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <Box
                    ml={{ base: 0, lg: "280px" }}
                    flex="1"
                    p={{ base: 3, sm: 4, lg: 8 }}
                    minH="100vh"
                >
                    <Box
                        maxW="4xl"
                        mx="auto"
                        bg="white"
                        borderRadius="lg"
                        shadow="sm"
                        border="1px solid"
                        borderColor="#E2E8F0"
                        overflow="hidden"
                        minH={{ base: "calc(100vh - 120px)", lg: "calc(100vh - 80px)" }}
                    >
                        <Box
                            bg="#F8F9FA"
                            p={{ base: 4, md: 6 }}
                            borderBottom="1px solid"
                            borderColor="#E2E8F0"
                        >
                            <PageTitle title={pageTitle} query={titleQuery} />
                        </Box>

                        <Box p={{ base: 4, md: 6 }} overflowY="auto">
                            {Children.toArray(children)}
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </>
    );
};

export default SubTemplate;
