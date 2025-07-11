import React, { useEffect, useState } from "react";
import { Flex, SimpleGrid, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import { PostCard } from "../../Components/PostCard";
import MainTemplate from "../../Templates/MainTemplate";
import serverUrl, { serverUrlV2 } from "../../Constants/Constants";

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
                <Skeleton isLoaded={isLoaded} fadeDuration={1}>
                    <SimpleGrid
                        spacing={4}
                        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    >
                        {writePosts.map((item) =>
                            <PostCard key={item.id} post={item} />
                        )}
                    </SimpleGrid>
                </Skeleton>
            </Flex>
        </MainTemplate>
    );
};

export default WritePostsList;
