import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrlV2 } from '../Constants/Constants';
import SubTemplate from '../Templates/SubTemplate';
import CategoryManagement from './Admin/CategoryManagement';
import Dashboard from './Admin/Dashboard';
import PostManagement from './Admin/PostManagement';
import TagManagement from './Admin/TagManagement';

const AdminPage = () => {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isTagsLoaded, setIsTagsLoaded] = useState(false);
    const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
    const [selectedTag, setSelectedTag] = useState('all');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadPosts();
        loadTags();
        loadCategories();
    }, []);

    // 태그 필터링 적용
    useEffect(() => {
        if (selectedTag === 'all') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post => post.tag === parseInt(selectedTag));
            setFilteredPosts(filtered);
        }
    }, [selectedTag, posts]);

    const loadPosts = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/posts`);
            setPosts(response.data.content);
            setFilteredPosts(response.data.content);
            setIsLoaded(true);
        } catch (error) {
            console.error('게시글 로드 실패:', error);
        }
    };

    const loadTags = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/tags`);
            setTags(response.data);
            setIsTagsLoaded(true);
        } catch (error) {
            console.error('태그 로드 실패:', error);
            // 태그 API가 없을 경우 기본 태그 사용
            setTags([
                { id: 1, tagName: "생각글", tagDescription: "생각과 고민을 나누는 글", tagColor: "#3498DB" },
                { id: 2, tagName: "일상만화", tagDescription: "만화와 그림 관련 글", tagColor: "#E74C3C" },
                { id: 3, tagName: "마크다운", tagDescription: "마크다운 파일", tagColor: "#9B59B6" },
                { id: 4, tagName: "파일", tagDescription: "다양한 파일들", tagColor: "#95A5A6" },
                { id: 5, tagName: "플레이리스트", tagDescription: "음악 플레이리스트", tagColor: "#F39C12" }
            ]);
            setIsTagsLoaded(true);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await axios.get(`${serverUrlV2}/categories`);
            setCategories(response.data);
            setIsCategoriesLoaded(true);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
            // 카테고리 API가 없을 경우 기본 카테고리 사용
            setCategories([
                { id: 1, categoryName: "생각글", categoryDescription: "생각과 고민을 나누는 글", categoryColor: "#3498DB", categoryPath: "/writes" },
                { id: 2, categoryName: "일상만화", categoryDescription: "만화와 그림 관련 글", categoryColor: "#E74C3C", categoryPath: "/toons" },
                { id: 3, categoryName: "마크다운", categoryDescription: "마크다운 파일", categoryColor: "#9B59B6", categoryPath: "/lists" },
                { id: 4, categoryName: "파일", categoryDescription: "다양한 파일들", categoryColor: "#95A5A6", categoryPath: "/files" },
                { id: 5, categoryName: "플레이리스트", categoryDescription: "음악 플레이리스트", categoryColor: "#F39C12", categoryPath: "/playlists" }
            ]);
            setIsCategoriesLoaded(true);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${serverUrlV2}/posts/${postId}`);
                loadPosts();
            } catch (error) {
                console.error('게시글 삭제 실패:', error);
            }
        }
    };

    const handleEdit = (post) => {
        navigate(`/admin/update/${post.id}`);
    };

    const handleView = (post) => {
        navigate(`/post/${post.id}`);
    };

    const handleCreateTag = async (newTag) => {
        try {
            await axios.post(`${serverUrlV2}/tags`, newTag);
            loadTags();
        } catch (error) {
            console.error('태그 생성 실패:', error);
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (window.confirm('이 태그를 삭제하시겠습니까? 관련된 게시글들의 태그가 초기화됩니다.')) {
            try {
                await axios.delete(`${serverUrlV2}/tags/${tagId}`);
                loadTags();
            } catch (error) {
                console.error('태그 삭제 실패:', error);
            }
        }
    };

    const handleCreateCategory = async (newCategory) => {
        try {
            await axios.post(`${serverUrlV2}/categories`, newCategory);
            loadCategories();
        } catch (error) {
            console.error('카테고리 생성 실패:', error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('이 카테고리를 삭제하시겠습니까? 관련된 게시글들의 카테고리가 초기화됩니다.')) {
            try {
                await axios.delete(`${serverUrlV2}/categories/${categoryId}`);
                loadCategories();
            } catch (error) {
                console.error('카테고리 삭제 실패:', error);
            }
        }
    };

    return (
        <SubTemplate pageTitle="어드민 페이지" titleQuery="관리">
            <Tabs variant="enclosed" colorScheme="yellow">
                <TabList>
                    <Tab>📊 대시보드</Tab>
                    <Tab>📋 게시글 관리</Tab>
                    <Tab>🏷️ 태그 관리</Tab>
                    <Tab>📚 카테고리 관리</Tab>
                </TabList>

                <TabPanels>
                    {/* 대시보드 탭 */}
                    <TabPanel>
                        <Dashboard posts={posts} tags={tags} categories={categories} />
                    </TabPanel>

                    {/* 게시글 관리 탭 */}
                    <TabPanel>
                        <PostManagement
                            posts={posts}
                            filteredPosts={filteredPosts}
                            tags={tags}
                            selectedTag={selectedTag}
                            setSelectedTag={setSelectedTag}
                            isLoaded={isLoaded}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                            handleView={handleView}
                        />
                    </TabPanel>

                    {/* 태그 관리 탭 */}
                    <TabPanel>
                        <TagManagement
                            tags={tags}
                            posts={posts}
                            isTagsLoaded={isTagsLoaded}
                            handleCreateTag={handleCreateTag}
                            handleDeleteTag={handleDeleteTag}
                        />
                    </TabPanel>

                    {/* 카테고리 관리 탭 */}
                    <TabPanel>
                        <CategoryManagement
                            categories={categories}
                            posts={posts}
                            isCategoriesLoaded={isCategoriesLoaded}
                            handleCreateCategory={handleCreateCategory}
                            handleDeleteCategory={handleDeleteCategory}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </SubTemplate>
    );
};

export default AdminPage; 