import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  VStack
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MainCard } from '../Components/MainCard';
import { PostCard } from '../Components/PostCard';
import { serverUrlV2 } from '../Constants/Constants';
import MainTemplate from "../Templates/MainTemplate";

const MainPage = () => {
  const [mainPostsdata, setMainPostsdata] = useState([]);
  const [writePosts, setWritePosts] = useState([]);
  const [imagePosts, setImagePosts] = useState([]);
  const [playlistPosts, setPlaylistPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 메인 포스트 데이터 로드
    axios.get(`${serverUrlV2}/posts`)
      .then((response) => {
        setMainPostsdata(response.data.content);
        setIsLoaded(true);
      })
      .catch((error) => console.log(error));

    // 생각글 데이터 로드
    axios.get(`${serverUrlV2}/posts?tag=1`)
      .then((response) => {
        setWritePosts(response.data.content.slice(0, 3)); // 최신 3개만
      })
      .catch((error) => console.log(error));

    // 일상만화 데이터 로드
    axios.get(`${serverUrlV2}/posts?tag=2`)
      .then((response) => {
        setImagePosts(response.data.content.slice(0, 3)); // 최신 3개만
      })
      .catch((error) => console.log(error));

    // 플레이리스트 데이터 로드
    axios.get(`${serverUrlV2}/posts?tag=5`)
      .then((response) => {
        setPlaylistPosts(response.data.content.slice(0, 3)); // 최신 3개만
      })
      .catch((error) => console.log(error));
  }, []);

  const GuestBookCard = () => {
    return (
      <Box
        maxW="sm"
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        color="#4A5568"
        borderColor="#E2E8F0"
        cursor="pointer"
        onClick={() => window.location.href = '/guestbook'}
        _hover={{
          shadow: 'md',
          borderColor: '#F7DC6F',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }}
        boxShadow="sm"
      >
        <Heading size="lg" color="#4A5568" fontFamily="monospace">방명록~</Heading>
        <Box mt={2} color="#A0AEC0" fontStyle="italic">{"<방명록써주십사..>"}</Box>
      </Box>
    );
  };

  return (
    <MainTemplate titleQuery={'옥해은'} pageTitle={'옥해은의 기록 아카이브'}>
      <Skeleton
        fadeDuration={1}
        isLoaded={isLoaded}
        startColor="#F8F9FA"
        endColor="#E2E8F0"
        borderRadius="lg"
      >
        <VStack spacing={8} align="stretch">
          {/* 인기글, 최신글, 방명록 - 기존 MainCard 형식 */}
          <Box display="flex" justifyContent="center">
            <SimpleGrid spacing={4} columns={3} maxW="36em">
              <MainCard key={6} ListTitle={"인기글"} post={mainPostsdata[0]} />
              <MainCard key={5} ListTitle={"최신글"} post={mainPostsdata[1]} />
              <GuestBookCard key={10} />
            </SimpleGrid>
          </Box>

          {/* 생각글 섹션 */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="#E2E8F0"
            color="#4A5568"
            boxShadow="sm"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '3px',
              bg: '#2C3E50',
              borderRadius: 'lg lg 0 0'
            }}
          >
            <Flex justify="flex-start" align="center" mb={4} gap={2}>
              <Heading size="md" color="#4A5568" fontFamily="monospace" textTransform="uppercase" letterSpacing="wider">
                💭 생각글
              </Heading>
              <Box flex="1" />
              <Button
                size="sm"
                colorScheme="yellow"
                variant="solid"
                bg="#F7DC6F"
                color="#4A5568"
                onClick={() => window.location.href = '/write'}
                _hover={{ bg: '#F4D03F', transform: 'scale(1.05)' }}
                fontFamily="monospace"
                fontWeight="bold"
                borderRadius="md"
                boxShadow="sm"
              >
                더보기 →
              </Button>
            </Flex>
            <VStack spacing={3} align="stretch">
              {writePosts.map(item => (
                <PostCard key={item.id} post={item} />
              ))}
            </VStack>
          </Box>

          {/* 일상만화 섹션 */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="#E2E8F0"
            color="#4A5568"
            boxShadow="sm"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '3px',
              bg: '#2C3E50',
              borderRadius: 'lg lg 0 0'
            }}
          >
            <Flex justify="flex-start" align="center" mb={4} gap={2}>
              <Heading size="md" color="#4A5568" fontFamily="monospace" textTransform="uppercase" letterSpacing="wider">
                🎨 일상만화
              </Heading>
              <Box flex="1" />
              <Button
                size="sm"
                colorScheme="yellow"
                variant="solid"
                bg="#F7DC6F"
                color="#4A5568"
                onClick={() => window.location.href = '/images'}
                _hover={{ bg: '#F4D03F', transform: 'scale(1.05)' }}
                fontFamily="monospace"
                fontWeight="bold"
                borderRadius="md"
                boxShadow="sm"
              >
                더보기 →
              </Button>
            </Flex>
            <VStack spacing={3} align="stretch">
              {imagePosts.map(item => (
                <PostCard key={item.id} post={item} />
              ))}
            </VStack>
          </Box>

          {/* 나의 플레이리스트 섹션 */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="#E2E8F0"
            color="#4A5568"
            boxShadow="sm"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '3px',
              bg: '#2C3E50',
              borderRadius: 'lg lg 0 0'
            }}
          >
            <Flex justify="flex-start" align="center" mb={4} gap={2}>
              <Heading size="md" color="#4A5568" fontFamily="monospace" textTransform="uppercase" letterSpacing="wider">
                🎵 나의 플레이리스트
              </Heading>
              <Box flex="1" />
              <Button
                size="sm"
                colorScheme="yellow"
                variant="solid"
                bg="#F7DC6F"
                color="#4A5568"
                onClick={() => window.location.href = '/playlist'}
                _hover={{ bg: '#F4D03F', transform: 'scale(1.05)' }}
                fontFamily="monospace"
                fontWeight="bold"
                borderRadius="md"
                boxShadow="sm"
              >
                더보기 →
              </Button>
            </Flex>
            <VStack spacing={3} align="stretch">
              {playlistPosts.map(item => (
                <PostCard key={item.id} post={item} />
              ))}
            </VStack>
          </Box>
        </VStack>
      </Skeleton>
    </MainTemplate>
  );
};

export default MainPage;
