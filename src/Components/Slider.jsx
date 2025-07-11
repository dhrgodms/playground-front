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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import axios from "axios";
import serverUrl from "../Constants/Constants";

export const Slider = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    const [mainPostsdata, setMainPostsdata] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);
    // useEffect(() => {
    //     axios
    //         .get(`${serverUrl}:8080/api/post/main-posts`)
    //         .then((response) => {
    //             setMainPostsdata(response.data);
    //             setIsLoaded(true);
    //         })
    //         .catch((error) => console.log(error));
    // }, []); // slider에도 반영해주어야함

    return (
        <>
            <Flex m={"5"} width={"full"} justify={"space-between"}>
                <Flex gap={"4"}>
                    <IconButton
                        ref={btnRef}
                        icon={<HamburgerIcon />}
                        colorScheme="green"
                        onClick={onOpen}
                        aria-label={"hambuger"}
                    />
                </Flex>
                <Button
                    ref={btnRef}
                    colorScheme="yellow"
                    onClick={() => navigate("/upload")}
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
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Heading size={"lg"} mb={3}>🆗 Haeeun.zip
                        </Heading>
                    </DrawerHeader>

                    <DrawerBody>
                        <Flex direction={"column"} gap={"1.5em"}>
                            <Button
                                ref={btnRef}
                                colorScheme="teal"
                                variant={"ghost"}
                                onClick={() => navigate("/")}
                            >
                                메인으로
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="teal"
                                variant={"ghost"}
                                onClick={() => navigate(`/all`)}
                            >
                                모둠글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="red"
                                variant={"ghost"}
                                onClick={() => navigate(`/post/${mainPostsdata[0]?.id}`)}
                            >
                                인기글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="teal"
                                variant={"ghost"}
                                onClick={() => navigate(`/post/${mainPostsdata[1]?.id}`)}
                            >
                                최신글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="green"
                                variant={"ghost"}
                                onClick={() => navigate(`/writes`)}
                            >
                                생각글
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="green"
                                variant={"ghost"}
                                onClick={() => navigate(`/toons`)}
                            >
                                일상만화
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="green"
                                variant={"ghost"}
                                onClick={() => navigate(`/lists`)}
                            >
                                내가 듣는 플레이리스트(Playlist)
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="green"
                                variant={"ghost"}
                                onClick={() => navigate(`/files`)}
                            >
                                uploaded files
                            </Button>
                            <Button
                                ref={btnRef}
                                colorScheme="pink"
                                variant={"ghost"}
                                onClick={() => navigate("/guestbook")}
                            >
                                어서오세요 방명록
                            </Button>
                        </Flex>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};
