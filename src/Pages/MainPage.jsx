import React from 'react';
import { PostLists } from '../Components/PostLists';
import MainTemplate from "../Templates/MainTemplate";
const MainPage = () => {
  return (
    <MainTemplate titleQuery={'옥해은'} pageTitle={'$ HaeeunOk(옥해은)의 기록 아카이브 !'}>
      <PostLists/>
    </MainTemplate>
  );
};

export default MainPage;
