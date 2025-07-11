import React, { useEffect, useState } from 'react';
import { Flex, SimpleGrid, Skeleton } from '@chakra-ui/react';
import axios from "axios";
import MainTemplate from "../../Templates/MainTemplate";
import { PostCard } from "../../Components/PostCard";
import serverUrl, { serverUrlV2 } from "../../Constants/Constants";

const ImagesPostsLists = () => {
    const [imagePosts, setImagePosts] = useState([{ id: 1, postListTile: '꾸잉', postNo: 1 }]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        (imagePosts?.length < 2) && axios.get(`${serverUrlV2}/posts?tag=2`).then(response => {
            setImagePosts(response.data.content);
            setIsLoaded(true);
        }).catch(error => console.log(error));
    }, []);
    return (
        <MainTemplate pageTitle={'끄적..만화 모음'} titleQuery={'만화'}>
            <Flex height={'100vh'} style={{ flexDirection: 'column' }}>
                <Skeleton isLoaded={isLoaded} fadeDuration={1}>
                    <SimpleGrid
                        spacing={4}
                        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    >
                        {imagePosts.map(item => (
                            <PostCard key={item.id} post={item} />
                        ))}
                    </SimpleGrid>
                </Skeleton>
            </Flex>
        </MainTemplate>
    );
};

export default ImagesPostsLists;
