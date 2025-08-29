import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Skeleton,
  Text,
  VStack
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MainCard } from '../Components/MainCard';
import { PostCard } from '../Components/PostCard';
import TagSystem from '../Components/TagSystem';
import { serverUrlV2 } from '../Constants/Constants';
import SubTemplate from "../Templates/SubTemplate";

const MainPage = () => {
  const [mainPostsdata, setMainPostsdata] = useState([]);
  const [writePosts, setWritePosts] = useState([]);
  const [imagePosts, setImagePosts] = useState([]);
  const [playlistPosts, setPlaylistPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const tagMapping = {
    1: { name: "생각글", icon: "💭", color: "#3498DB" },
    2: { name: "일상만화", icon: "🎨", color: "#E74C3C" },
    3: { name: "마크다운", icon: "📁", color: "#9B59B6" },
    4: { name: "파일", icon: "📄", color: "#95A5A6" },
    5: { name: "플레이리스트", icon: "🎵", color: "#F39C12" },
  };

  const tags = Object.entries(tagMapping).map(([id, info]) => ({
    id: parseInt(id),
    name: info.name,
    icon: info.icon,
    color: info.color,
    count: allPosts.filter(post => post.categoryId === parseInt(id)).length
  }));

  useEffect(() => {
    // 모든 포스트 데이터 로드
    axios.get(`${serverUrlV2}/posts`)
      .then((response) => {
        const allData = response.data.content;
        setAllPosts(allData);
        setMainPostsdata(allData);
        setIsLoaded(true);
      })
      .catch((error) => console.log(error));

    // 생각글 데이터 로드
    axios.get(`${serverUrlV2}/posts?categoryId=1`)
      .then((response) => {
        setWritePosts(response.data.content.slice(0, 3));
      })
      .catch((error) => console.log(error));

    // 일상만화 데이터 로드
    axios.get(`${serverUrlV2}/posts?categoryId=2`)
      .then((response) => {
        setImagePosts(response.data.content.slice(0, 3));
      })
      .catch((error) => console.log(error));

    // 플레이리스트 데이터 로드
    axios.get(`${serverUrlV2}/posts?categoryId=3`)
      .then((response) => {
        setPlaylistPosts(response.data.content.slice(0, 3));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post => {
        const postTag = tagMapping[post.categoryId];
        return postTag && selectedTags.includes(postTag.name);
      });
      setFilteredPosts(filtered);
    }
  }, [selectedTags, allPosts]);

  const handleTagSelect = (tagName) => {
    setSelectedTags(prev => [...prev, tagName]);
  };

  const handleTagDeselect = (tagName) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagName));
  };

  const WelcomeSection = () => (
    <Box
      bg="linear-gradient(135deg, #F7DC6F 0%, #F4D03F 100%)"
      p={{ base: 6, md: 8 }}
      borderRadius="xl"
      textAlign="center"
      mb={8}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3
      }}
    >
      <Heading size={{ base: "xl", md: "2xl" }} color="#2C3E50" fontFamily="monospace" mb={4}>
        🆗 Haeeun.zip
      </Heading>
      <Text fontSize={{ base: "md", md: "lg" }} color="#4A5568" mb={6} fontFamily="monospace">
        생각글, 일상만화, 마크다운 파일들을 공유하는 개인 아카이브
      </Text>
      <HStack spacing={4} justify="center" wrap="wrap">
        <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
          💭 생각글
        </Badge>
        <Badge colorScheme="green" variant="solid" px={3} py={1} borderRadius="full">
          🎨 일상만화
        </Badge>
        <Badge colorScheme="purple" variant="solid" px={3} py={1} borderRadius="full">
          📁 마크다운
        </Badge>
      </HStack>
    </Box>
  );

  const QuickStats = () => (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} mb={8}>
      <MainCard key={6} ListTitle={"🔥 인기글"} post={mainPostsdata[0]} />
      <MainCard key={5} ListTitle={"📝 최신글"} post={mainPostsdata[1]} />
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        border="1px solid"
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
        textAlign="center"
      >
        <Heading size="md" color="#2C3E50" fontFamily="monospace" mb={3}>
          📮 방명록
        </Heading>
        <Text fontSize="sm" color="#718096" fontStyle="italic">
          방문자들의 소중한 메시지
        </Text>
        <Text fontSize="xs" color="#A0AEC0" mt={2}>
          💬 메시지 남기기
        </Text>
      </Box>
    </SimpleGrid>
  );

  const FilterSection = () => (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor="#E2E8F0"
      boxShadow="sm"
      mb={6}
    >
      <TagSystem
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagDeselect={handleTagDeselect}
        showCount={true}
        maxDisplay={5}
      />
    </Box>
  );

  const ContentSection = ({ title, icon, posts, moreLink, color }) => (
    <Box
      bg="white"
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      border="1px solid"
      borderColor="#E2E8F0"
      boxShadow="sm"
      mb={6}
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
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={3}>
          <Text fontSize={{ base: "xl", md: "2xl" }}>{icon}</Text>
          <Heading size={{ base: "sm", md: "md" }} color="#2C3E50" fontFamily="monospace">
            {title}
          </Heading>
        </HStack>
        <Button
          size="sm"
          colorScheme="yellow"
          variant="ghost"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => window.location.href = moreLink}
          _hover={{ bg: '#F7DC6F' }}
          fontFamily="monospace"
          fontWeight="medium"
          display={{ base: "none", sm: "flex" }}
        >
          더보기
        </Button>
      </Flex>

      {posts.length > 0 ? (
        <VStack spacing={3} align="stretch">
          {posts.map(item => (
            <PostCard key={item.id} post={item} />
          ))}
        </VStack>
      ) : (
        <Box textAlign="center" py={8}>
          <Text color="#718096" fontSize="sm">
            아직 게시글이 없습니다.
          </Text>
        </Box>
      )}
    </Box>
  );

  const FilteredPostsSection = () => {
    if (selectedTags.length === 0) return null;

    return (
      <Box
        bg="white"
        p={{ base: 4, md: 6 }}
        borderRadius="lg"
        border="1px solid"
        borderColor="#E2E8F0"
        boxShadow="sm"
        mb={6}
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
        <Flex justify="space-between" align="center" mb={4}>
          <HStack spacing={3}>
            <Text fontSize={{ base: "xl", md: "2xl" }}>🔍</Text>
            <Heading size={{ base: "sm", md: "md" }} color="#2C3E50" fontFamily="monospace">
              필터된 결과 ({filteredPosts.length}개)
            </Heading>
          </HStack>
          <Button
            size="sm"
            colorScheme="gray"
            variant="ghost"
            onClick={() => setSelectedTags([])}
            fontFamily="monospace"
            fontWeight="medium"
          >
            필터 초기화
          </Button>
        </Flex>

        {filteredPosts.length > 0 ? (
          <VStack spacing={3} align="stretch">
            {filteredPosts.slice(0, 5).map(item => (
              <PostCard key={item.id} post={item} />
            ))}
            {filteredPosts.length > 5 && (
              <Text fontSize="sm" color="#718096" textAlign="center" py={2}>
                ... 그리고 {filteredPosts.length - 5}개 더
              </Text>
            )}
          </VStack>
        ) : (
          <Box textAlign="center" py={8}>
            <Text color="#718096" fontSize="sm">
              선택한 필터에 맞는 게시글이 없습니다.
            </Text>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <SubTemplate titleQuery={'옥해은'} pageTitle={'옥해은의 기록 아카이브'}>
      <Skeleton
        fadeDuration={1}
        isLoaded={isLoaded}
        startColor="#F8F9FA"
        endColor="#E2E8F0"
        borderRadius="lg"
      >
        <VStack spacing={8} align="stretch">
          <QuickStats />
          <FilterSection />
          <FilteredPostsSection />

          <ContentSection
            title="생각글"
            icon="💭"
            posts={writePosts}
            moreLink="/writes"
            color="#3498DB"
          />

          <ContentSection
            title="일상만화"
            icon="🎨"
            posts={imagePosts}
            moreLink="/toons"
            color="#E74C3C"
          />

          <ContentSection
            title="나의 플레이리스트"
            icon="🎵"
            posts={playlistPosts}
            moreLink="/playlist"
            color="#9B59B6"
          />
        </VStack>
      </Skeleton>
    </SubTemplate>
  );
};

export default MainPage;
