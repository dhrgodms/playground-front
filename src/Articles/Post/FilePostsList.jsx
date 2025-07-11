import React, { useEffect, useState } from "react";
import { Flex, SimpleGrid, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import MainTemplate from "../../Templates/MainTemplate";
import { PostCard } from "../../Components/PostCard";
import { serverUrlV2 } from "../../Constants/Constants";

const FilePostsList = () => {
    const [filePosts, setFilePosts] = useState([
        { id: 1, postListTile: "꾸잉", postNo: 1 },
    ]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        filePosts?.length < 2 &&
            axios
                .get(`${serverUrlV2}/posts?tag=4`)
                .then((response) => {
                    setFilePosts(response.data);
                    setIsLoaded(true);
                })
                .catch((error) => console.log(error));
    }, []);
    return (
        <MainTemplate pageTitle={"File Post List Testpage"} titleQuery={"파일"}>
            <Flex height={"100vh"} style={{ flexDirection: "column" }}>
                <Skeleton isLoaded={isLoaded} fadeDuration={1}>
                    <SimpleGrid
                        spacing={4}
                        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    >
                        {filePosts.map((item) => (
                            <PostCard key={item.id} post={item} />
                        ))}
                    </SimpleGrid>
                </Skeleton>
            </Flex>
        </MainTemplate>
    );
};

export default FilePostsList;
