import { Flex, Skeleton, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PostCard } from "../../Components/PostCard";
import { serverUrlV2 } from "../../Constants/Constants";
import MainTemplate from "../../Templates/MainTemplate";

const MarkdownPostLists = () => {
    const [writePosts, setWritePosts] = useState([
        { id: 1, postListTile: "꾸잉", postNo: 1 },
    ]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        writePosts?.length &&
            axios
                .get(`${serverUrlV2}/posts?tag=3`)
                .then((response) => {
                    setWritePosts(response.data.content);
                    setIsLoaded(true);
                })
                .catch((error) => console.log(error));
    }, []);
    return (
        <MainTemplate pageTitle={"md file view"} titleQuery={"markdown file"}>
            <Flex height={"100vh"} style={{ flexDirection: "column" }}>
                <Skeleton isLoaded={isLoaded} fadeDuration={1}>
                    <VStack spacing={4} align="stretch">
                        {writePosts.map((item) =>
                            item.id > 1 ? <PostCard key={item.id} post={item} /> : null
                        )}
                    </VStack>
                </Skeleton>
            </Flex>
        </MainTemplate>
    );
};

export default MarkdownPostLists;
