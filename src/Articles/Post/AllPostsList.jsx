import { Flex, VStack } from '@chakra-ui/react';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { PostCard } from "../../Components/PostCard";
import { serverUrlV2 } from "../../Constants/Constants";
import MainTemplate from "../../Templates/MainTemplate";

const AllPostsList = () => {
    const [writePosts, setWritePosts] = useState([{ id: 1, postListTile: '꾸잉', postNo: 1 }]);

    useEffect(() => {
        axios.get(`${serverUrlV2}/posts`).then(response => setWritePosts(response.data.content)).catch(error => console.log(error));
    }, []);
    return (
        <MainTemplate pageTitle={'모두 모아보기'} titleQuery={'모두'}>
            <Flex height={'100vh'} style={{ flexDirection: 'column' }}>
                <VStack spacing={4} align="stretch">
                    {console.log(writePosts)}
                    {writePosts.map(item => (
                        <PostCard key={item.id} post={item} />
                    ))}
                </VStack>
            </Flex>
        </MainTemplate>
    );
};

export default AllPostsList;