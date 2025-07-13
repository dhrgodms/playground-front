import { ChatIcon, DownloadIcon, ExternalLinkIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Image,
  Link,
  Skeleton,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToTop from "../../Atoms/ScrollToTop";
import CommentContainer from "../../Components/Comments";
import { serverUrl, serverUrlV2 } from "../../Constants/Constants";
import SubTemplate from "../../Templates/SubTemplate";

const DefaultPost = () => {
  const { id } = useParams();
  const [writePost, setWritePost] = useState({
    id: 1,
    thumbnail: `${serverUrl}/white.jpg`,
    contentTitle: "",
    fileUrls: [], // 파일 URL들을 저장할 배열 추가
  });
  const [commentAll, setCommentAll] = useState([
    {
      commentContent: "",
      commentNickname: "",
      commentPassword: "",
      postId: id,
    },
  ]);
  const toast = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  async function handleLikes(e) {
    e.preventDefault();
    try {
      axios.post(`${serverUrlV2}/posts/${id}/like`).then((res) => {
        if (res?.data) {
          setWritePost({ ...writePost, likes: res.data });
        } else {
          toast({
            title: `잉ㅠ좋아요 실패`,
            status: "error",
            isClosable: true,
          });
        }
      });
    } catch (e) {
      console.error(e);
      toast({
        title: `잉ㅠ좋아요 실패`,
        status: "error",
        isClosable: true,
      });
    }
  }

  // 게시글 정보, 댓글 가져오기 (새로운 API 사용)
  useEffect(() => {
    axios
      .get(`${serverUrlV2}/posts/${id}`)
      .then((response) => {
        setWritePost(response.data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "게시글을 불러오는데 실패했습니다.",
          status: "error",
          isClosable: true,
        });
      });

    axios
      .get(`${serverUrl}:8080/api/comment/all/${id}`)
      .then((response) => {
        setCommentAll(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  // tag가 2(만화글)일 때 이미지 가져오기
  useEffect(() => {
    if (writePost.tag === 2) {
      axios
        .get(`${serverUrl}:8080/api/image/all/${id}`)
        .then((response) => {
          setImages(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [id, writePost.tag]);

  // 파일 확장자에 따라 아이콘과 표시 방식을 결정하는 함수
  const getFileDisplayInfo = (fileUrl) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return { type: 'image', icon: null };
    } else if (['md', 'markdown'].includes(extension)) {
      return { type: 'markdown', icon: null };
    } else if (['pdf'].includes(extension)) {
      return { type: 'pdf', icon: <DownloadIcon /> };
    } else if (['doc', 'docx'].includes(extension)) {
      return { type: 'document', icon: <DownloadIcon /> };
    } else if (['xls', 'xlsx'].includes(extension)) {
      return { type: 'spreadsheet', icon: <DownloadIcon /> };
    } else {
      return { type: 'file', icon: <DownloadIcon /> };
    }
  };

  return (
    <Skeleton
      isLoaded={isLoaded}
      fadeDuration={1}
      startColor="#F8F9FA"
      endColor="#E2E8F0"
      borderRadius="lg"
    >
      <SubTemplate
        pageTitle={writePost.contentTitle}
        titleQuery={writePost.contentTitle}
      >
        <ScrollToTop />
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
          <HStack justify={"space-between"} mb={4}>
            <Flex gap={2}>
              <Tag size={"lg"} colorScheme={"pink"} variant={"solid"} bg="#E74C3C">
                <TagLeftIcon as={ViewIcon} />
                <TagLabel>{writePost.views}</TagLabel>
              </Tag>
              <Tag size={"lg"} colorScheme={"blue"} variant={"solid"} bg="#2C3E50">
                <TagLeftIcon as={ChatIcon} />
                <TagLabel>{commentAll.length}</TagLabel>
              </Tag>
              <Tag size={"lg"} colorScheme={"red"} variant={"solid"} bg="#E74C3C">
                <TagLeftIcon as={AiFillHeart} />
                <TagLabel>{writePost.likes}</TagLabel>
              </Tag>
            </Flex>
            <Flex justify={"flex-end"}>
              <Button
                type={"submit"}
                onClick={handleLikes}
                aria-label={"likes"}
                colorScheme={"pink"}
                bg="#E74C3C"
                color="white"
                _hover={{ bg: '#C0392B' }}
              >
                <AiFillHeart />
              </Button>
            </Flex>
          </HStack>
          <Card bg="white" border="1px solid" borderColor="#E2E8F0" shadow="sm">
            <CardBody>
              {/* 모든 content를 마크다운으로 렌더링 */}
              <MDEditor.Markdown
                source={writePost.content}
                style={{
                  whiteSpace: "pre-wrap",
                  backgroundColor: "white",
                  color: "#4A5568",
                }}
              />

              {/* 기존 이미지들 표시 */}
              {images.map((image, index) => (
                <Image key={index} src={image.url} alt={image.id} />
              ))}

              {/* 첨부 파일들 표시 */}
              {writePost.fileUrls && writePost.fileUrls.length > 0 && (
                <Box mt={4}>
                  <Text fontSize="lg" fontWeight="bold" mb={3} color="#4A5568">
                    첨부 파일
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {writePost.fileUrls.map((fileUrl, index) => {
                      const fileInfo = getFileDisplayInfo(fileUrl);
                      const fileName = fileUrl.split('/').pop();

                      return (
                        <Box key={index} p={3} border="1px" borderColor="#E2E8F0" borderRadius="md" bg="#F8F9FA">
                          {fileInfo.type === 'image' ? (
                            <VStack spacing={2}>
                              <Text fontWeight="medium" color="#4A5568">{fileName}</Text>
                              <Image
                                src={fileUrl}
                                alt={fileName}
                                maxH="400px"
                                objectFit="contain"
                                borderRadius="md"
                              />
                              <Link href={fileUrl} isExternal color="#2C3E50">
                                <HStack>
                                  <ExternalLinkIcon />
                                  <Text>원본 보기</Text>
                                </HStack>
                              </Link>
                            </VStack>
                          ) : (
                            <HStack justify="space-between">
                              <HStack>
                                {fileInfo.icon}
                                <Text fontWeight="medium" color="#4A5568">{fileName}</Text>
                              </HStack>
                              <Link href={fileUrl} isExternal color="#2C3E50">
                                <HStack>
                                  <DownloadIcon />
                                  <Text>다운로드</Text>
                                </HStack>
                              </Link>
                            </HStack>
                          )}
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>
        <CommentContainer
          id={id}
          commentAll={commentAll}
          setCommentAll={setCommentAll}
          writePost={writePost}
        />
      </SubTemplate>
    </Skeleton>
  );
};

export default DefaultPost;
