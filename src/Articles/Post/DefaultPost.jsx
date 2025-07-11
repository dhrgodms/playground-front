import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Image,
  Skeleton,
  Tag,
  TagLabel,
  TagLeftIcon,
  useToast,
  VStack,
  Text,
  Link,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import SubTemplate from "../../Templates/SubTemplate";
import ScrollToTop from "../../Atoms/ScrollToTop";
import { ChatIcon, EditIcon, ViewIcon, DownloadIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import MDEditor from "@uiw/react-md-editor";
import { serverUrl, serverUrlV2 } from "../../Constants/Constants";
import CommentContainer from "../../Components/Comments";

// Markdown 파일을 렌더링하는 컴포넌트
const MarkdownRenderer = ({ fileUrl }) => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error("Markdown 파일을 불러오는데 실패했습니다:", error);
        setMarkdownContent("파일을 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [fileUrl]);

  if (isLoading) {
    return <Text>로딩 중...</Text>;
  }

  return (
    <MDEditor.Markdown
      source={markdownContent}
      style={{
        whiteSpace: "pre-wrap",
        backgroundColor: "white",
        color: "black",
      }}
    />
  );
};

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
  const [markdown, setMarkdown] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
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

  // tag가 3(MD파일)일 때 파일 및 마크다운 내용 가져오기
  useEffect(() => {
    if (writePost.tag === 3) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${serverUrl}:8080/api/files/all/${id}`
          );
          setFiles(response.data);

          // 여러 파일이 있을 경우, 첫 번째 파일만 마크다운으로 표시 (필요시 로직 수정)
          if (response.data.length > 0) {
            const file = response.data[0];
            if (file.filePath) {
              try {
                const text = await fetch(`${serverUrl}${file.filePath}`).then((res) => res.text());
                setMarkdown(text);
              } catch (error) {
                console.error("파일 경로에서 MD 내용을 가져오는데 실패:", error);
              }
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsFetching(false);
        }
      };
      if (!isFetching) {
        setIsFetching(true);
        fetchData();
      }
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
    <Skeleton isLoaded={isLoaded} fadeDuration={1}>
      <SubTemplate
        pageTitle={writePost.contentTitle}
        titleQuery={writePost.contentTitle}
      >
        <Flex justify={"flex-end"}>
          <IconButton
            icon={<EditIcon />}
            aria-label="editPost"
            onClick={() => navigate(`/post/update/${id}`)}
          />
        </Flex>
        <ScrollToTop />
        <HStack justify={"space-between"}>
          <Flex gap={3}>
            <Tag size={"md"} key={1} variant="subtle" colorScheme="gray">
              <TagLeftIcon boxsiz="12px" as={ViewIcon} />
              <TagLabel>{writePost.views}</TagLabel>
            </Tag>
            <Tag size={"md"} key={2} variant="subtle" colorScheme="cyan">
              <TagLeftIcon boxsiz="12px" as={ChatIcon} />
              <TagLabel>{commentAll.length}</TagLabel>
            </Tag>
            <Tag size={"md"} key={3} variant="subtle" colorScheme="pink">
              <TagLeftIcon boxsiz="12px" as={AiFillHeart} />
              <TagLabel>{writePost.likes}</TagLabel>
            </Tag>
          </Flex>
          <Flex justify={"flex-end"}>
            <Button
              type={"submit"}
              onClick={handleLikes}
              aria-label={"likes"}
              colorScheme={"pink"}
            >
              <AiFillHeart />
            </Button>
          </Flex>
        </HStack>
        <Card>
          <CardBody>
            {/* MD 파일이 있는 경우 content는 표시하지 않음 */}
            {writePost.fileUrls && writePost.fileUrls.length > 0 &&
              writePost.fileUrls.filter(fileUrl => {
                const fileInfo = getFileDisplayInfo(fileUrl);
                return fileInfo.type === 'markdown';
              }).length > 0 ? (
              // MD 파일이 있으면 content 대신 MD 파일들만 표시
              writePost.fileUrls
                .filter(fileUrl => {
                  const fileInfo = getFileDisplayInfo(fileUrl);
                  return fileInfo.type === 'markdown';
                })
                .map((fileUrl, index) => (
                  <Box key={`md-${index}`}>
                    <MarkdownRenderer fileUrl={fileUrl} />
                  </Box>
                ))
            ) : (
              // MD 파일이 없으면 기존 content 표시
              <>
                {writePost.tag === 3 ? (
                  <MDEditor.Markdown
                    source={markdown}
                    style={{
                      whiteSpace: "pre-wrap",
                      backgroundColor: "white",
                      color: "black",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    {writePost.content}
                  </div>
                )}

                {/* 기존 이미지들 표시 */}
                {images.map((image, index) => (
                  <Image key={index} src={image.url} alt={image.id} />
                ))}
              </>
            )}

            {/* MD 파일이 아닌 첨부 파일들만 표시 */}
            {writePost.fileUrls && writePost.fileUrls.length > 0 &&
              writePost.fileUrls.filter(fileUrl => {
                const fileInfo = getFileDisplayInfo(fileUrl);
                return fileInfo.type !== 'markdown';
              }).length > 0 && (
                <Box mt={4}>
                  <Text fontSize="lg" fontWeight="bold" mb={3}>
                    첨부 파일
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {writePost.fileUrls
                      .filter(fileUrl => {
                        const fileInfo = getFileDisplayInfo(fileUrl);
                        return fileInfo.type !== 'markdown';
                      })
                      .map((fileUrl, index) => {
                        const fileInfo = getFileDisplayInfo(fileUrl);
                        const fileName = fileUrl.split('/').pop();

                        return (
                          <Box key={index} p={3} border="1px" borderColor="gray.200" borderRadius="md">
                            {fileInfo.type === 'image' ? (
                              <VStack spacing={2}>
                                <Text fontWeight="medium">{fileName}</Text>
                                <Image
                                  src={fileUrl}
                                  alt={fileName}
                                  maxH="400px"
                                  objectFit="contain"
                                  borderRadius="md"
                                />
                                <Link href={fileUrl} isExternal color="blue.500">
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
                                  <Text fontWeight="medium">{fileName}</Text>
                                </HStack>
                                <Link href={fileUrl} isExternal color="blue.500">
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
              )
            }

            {/* MD 파일이 아닌 첨부 파일들만 표시 */}
            {writePost.fileUrls && writePost.fileUrls.length > 0 &&
              writePost.fileUrls.filter(fileUrl => {
                const fileInfo = getFileDisplayInfo(fileUrl);
                return fileInfo.type !== 'markdown';
              }).length > 0 && (
                <Box mt={4}>
                  <Text fontSize="lg" fontWeight="bold" mb={3}>
                    첨부 파일
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {writePost.fileUrls
                      .filter(fileUrl => {
                        const fileInfo = getFileDisplayInfo(fileUrl);
                        return fileInfo.type !== 'markdown';
                      })
                      .map((fileUrl, index) => {
                        const fileInfo = getFileDisplayInfo(fileUrl);
                        const fileName = fileUrl.split('/').pop();

                        return (
                          <Box key={index} p={3} border="1px" borderColor="gray.200" borderRadius="md">
                            {fileInfo.type === 'image' ? (
                              <VStack spacing={2}>
                                <Text fontWeight="medium">{fileName}</Text>
                                <Image
                                  src={fileUrl}
                                  alt={fileName}
                                  maxH="400px"
                                  objectFit="contain"
                                  borderRadius="md"
                                />
                                <Link href={fileUrl} isExternal color="blue.500">
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
                                  <Text fontWeight="medium">{fileName}</Text>
                                </HStack>
                                <Link href={fileUrl} isExternal color="blue.500">
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
              )
            }
          </CardBody>
        </Card>
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
