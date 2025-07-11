import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import MainPage from './Pages/MainPage';
import DefaultPost from './Articles/Post/DefaultPost';
import MarkdownPostLists from './Articles/Post/MarkdownPostLists';
import GuestBook from './Articles/Post/GuestBook';
import WritePostsList from './Articles/Post/WritePostsList';
import ImagesPostsLists from './Articles/Post/ImagesPostsLists';
import LoginPage from "./Pages/LoginPage";
import UploadPostPage from "./Pages/UploadPostPage";
import UpdatePostPage from "./Pages/UpdatePostPage";
import AllPostsList from "./Articles/Post/AllPostsList";
import SignUpPage from "./Pages/SignUpPage";
import FilePostsList from "./Articles/Post/FilePostsList";

function App() {

    return (
        <ChakraProvider>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/post/:id" element={<DefaultPost />} />
                <Route path="/upload" element={<UploadPostPage />} />
                <Route path="/post/update/:id" element={<UpdatePostPage />} />
                <Route path="/admin" element={<adminDefaultPost />} />
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
