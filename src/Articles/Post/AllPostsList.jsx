import React, { useEffect, useState } from 'react';
import { Flex, SimpleGrid } from '@chakra-ui/react';
import axios from "axios";
import { PostCard } from "../../Components/PostCard";
import MainTemplate from "../../Templates/MainTemplate";
import serverUrl, { serverUrlV2 } from "../../Constants/Constants";

const AllPostsList = () => {
    const [writePosts, setWritePosts] = useState([{ id: 1, postListTile: '꾸잉', postNo: 1 }]);

    useEffect(() => {
        axios.get(`${serverUrlV2}/posts`).then(response => setWritePosts(response.data.content)).catch(error => console.log(error));
    }, []);
    return (
        <MainTemplate pageTitle={'모두 모아보기'} titleQuery={'모두'}>
            <Flex height={'100vh'} style={{ flexDirection: 'column' }}>
                <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                >
                    {console.log(writePosts)}
                    {writePosts.map(item => (
                        <PostCard key={item.id} post={item} />
                    ))}
                </SimpleGrid>
            </Flex>
        </MainTemplate>
    );
};

export default AllPostsList;