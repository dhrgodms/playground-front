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
import React, { Children, useState } from "react";
import { useNavigate } from "react-router-dom";
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
                                color="#2C3E50"
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
                                md files
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="yellow"
                                variant={"ghost"}
                                bg="#F7DC6F"
                                color="#2C3E50"
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
const SubTemplate = ({ children, pageTitle, titleQuery }) => {
    return (
        <>
            <Flex direction={"column"} align={"center"} bg="#F5F5F5" minH="100vh">
                <Flex width={"95vw"}>
                    <SubSlider />
                </Flex>
                <Flex
                    direction={"column"}
                    gap={"30px"}
                    m={5}
                    width={"70vw"}
                    justify={"center"}
                    bg="white"
                    p={8}
                    borderRadius="lg"
                    shadow="md"
                    border="1px solid"
                    borderColor="#E2E8F0"
                >
                    <PageTitle title={pageTitle} query={titleQuery} />
                    {Children.toArray(children)}
                </Flex>
            </Flex>
        </>
    );
};

export default SubTemplate;
