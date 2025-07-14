import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Button,
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
    useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Slider = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    const [mainPostsdata, setMainPostsdata] = useState([]);

    return (
        <>
            <Flex
                width={"100%"}
                justify={"space-between"}
                p={4}
                borderRadius="md"
            >
                <Flex gap={"4"}>
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
                <Button
                    ref={btnRef}
                    colorScheme="yellow"
                    bg="#F7DC6F"
                    color="#4A5568"
                    onClick={() => navigate("/admin/upload")}
                    _hover={{ bg: '#F4D03F', transform: 'scale(1.05)' }}
                >
                    UPLOAD
                </Button>
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
                                onClick={() => navigate(`/all`)}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                모둠글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#2C3E50"
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
                                color="#2C3E50"
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
                                color="#2C3E50"
                                onClick={() => navigate(`/lists`)}
                                _hover={{ bg: '#F4D03F' }}
                            >
                                내가 듣는 플레이리스트(Playlist)
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="gray"
                                variant={"ghost"}
                                bg="#6B7280"
                                color="white"
                                onClick={() => navigate("/guestbook")}
                                _hover={{ bg: '#4B5563' }}
                            >
                                어서오세요 방명록
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
