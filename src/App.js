import { ChakraProvider } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AllPostsList from "./Articles/Post/AllPostsList";
import DefaultPost from './Articles/Post/DefaultPost';
import FilePostsList from "./Articles/Post/FilePostsList";
import GuestBook from './Articles/Post/GuestBook';
import ImagesPostsLists from './Articles/Post/ImagesPostsLists';
import MarkdownPostLists from './Articles/Post/MarkdownPostLists';
import WritePostsList from './Articles/Post/WritePostsList';
import AdminPage from "./Pages/AdminPage";
import LoginPage from "./Pages/LoginPage";
import MainPage from './Pages/MainPage';
import SignUpPage from "./Pages/SignUpPage";
import UpdatePostPage from "./Pages/UpdatePostPage";
import UploadPostPage from "./Pages/UploadPostPage";

function App() {

    return (
        <ChakraProvider>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/post/:id" element={<DefaultPost />} />
                <Route path="/admin/upload" element={<UploadPostPage />} />
                <Route path="/admin/update/:id" element={<UpdatePostPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/writes" element={<WritePostsList />} />
                <Route path="/toons" element={<ImagesPostsLists />} />
                <Route path="/lists" element={<MarkdownPostLists />} />
                <Route path="/files" element={<FilePostsList />} />
                <Route path="/all" element={<AllPostsList />} />
                <Route path="/guestbook" element={<GuestBook />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />


            </Routes>
        </ChakraProvider>
    );
}

export default App;
