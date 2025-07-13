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
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import React, { Children, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageTitle } from "../Atoms/PageTitle";

const SubSlider = () => {
    const [mainPostsdata, setMainPostsdata] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

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
                                메인으로
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
                                인기글
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
                                최신글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#4A5568"
                                onClick={() => navigate(`/writes`)}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                생각글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#4A5568"
                                onClick={() => navigate(`/toons`)}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                일상만화
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#4A5568"
                                onClick={() => navigate(`/lists`)}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                md files
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#4A5568"
                                onClick={() => navigate("/guestbook")}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                어서오세요 방명록
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

    const menuItems = [
        { name: "메인으로", path: "/", icon: "🏠" },
        { name: "인기글", path: "/post/1", icon: "🔥" },
        { name: "최신글", path: "/post/2", icon: "📝" },
        { name: "생각글", path: "/writes", icon: "💭" },
        { name: "일상만화", path: "/toons", icon: "🎨" },
        { name: "md files", path: "/lists", icon: "📁" },
        { name: "방명록", path: "/guestbook", icon: "📮" },
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

                <VStack spacing={2} align="stretch">
                    {menuItems.map((item, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            justifyContent="flex-start"
                            h="auto"
                            py={3}
                            px={4}
                            bg={location.pathname === item.path ? "#F7DC6F" : "transparent"}
                            color={location.pathname === item.path ? "#2C3E50" : "#4A5568"}
                            _hover={{ bg: location.pathname === item.path ? "#F4D03F" : "#F8F9FA" }}
                            onClick={() => navigate(item.path)}
                            borderRadius="md"
                            fontWeight="medium"
                            fontSize={{ base: "sm", lg: "md" }}
                        >
                            <Text mr={3} fontSize="lg">{item.icon}</Text>
                            {item.name}
                        </Button>
                    ))}
                </VStack>

                <Divider my={6} borderColor="#E2E8F0" />

                <Box>
                    <Text fontSize="sm" color="#718096" mb={2}>
                        About
                    </Text>
                    <Text fontSize="xs" color="#4A5568" lineHeight="1.6">
                        개인 블로그입니다. 생각글, 일상만화, 마크다운 파일들을 공유합니다.
                    </Text>
                </Box>
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
