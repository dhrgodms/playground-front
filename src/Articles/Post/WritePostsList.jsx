import { Flex, Skeleton, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PostCard } from "../../Components/PostCard";
import { serverUrlV2 } from "../../Constants/Constants";
import MainTemplate from "../../Templates/MainTemplate";

const WritePostsList = () => {
    const [writePosts, setWritePosts] = useState([
        { id: 1, postListTile: "꾸잉", postNo: 1 },
    ]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        axios
            .get(`${serverUrlV2}/posts?tag=1`)
            .then((response) => {
                setWritePosts(response.data.content);
                setIsLoaded(true);
            })
            .catch((error) => console.log(error));
    }, []); // 빈 배열로 수정!
    return (
        <MainTemplate pageTitle={"글 모음"} titleQuery={"글"}>
            <Flex height={"100vh"} style={{ flexDirection: "column" }}>
                <Skeleton
                    isLoaded={isLoaded}
                    fadeDuration={1}
                    startColor="#F8F9FA"
                    endColor="#E2E8F0"
                    borderRadius="lg"
                >
                    <VStack spacing={4} align="stretch">
                        {writePosts.map((item) =>
                            <PostCard key={item.id} post={item} />
                        )}
                    </VStack>
                </Skeleton>
            </Flex>
        </MainTemplate>
    );
};

export default WritePostsList;
