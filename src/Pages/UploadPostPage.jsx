import {
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from '@chakra-ui/react';
import React from 'react';
import { FileForm } from "../Articles/UploadForm/FileForm";
import MarkdownForm from "../Articles/UploadForm/MarkdownForm";
import SubTemplate from "../Templates/SubTemplate";

function UploadForm() {
    return (
        <Tabs variant='soft-rounded' colorScheme='gray'>
            <TabList bg="#F9FAFB" borderRadius="md" p={1}>
                <Tab
                    _selected={{
                        bg: '#6B7280',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                    color="#6B7280"
                >
                    .md
                </Tab>
                <Tab
                    _selected={{
                        bg: '#6B7280',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                    color="#6B7280"
                >
                    Files
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <MarkdownForm redirectTo="/admin" />
                </TabPanel>
                <TabPanel>
                    <FileForm redirectTo="/admin" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

function UploadPostPage() {
    return (
        <SubTemplate pageTitle="게시글 작성" titleQuery="작성">
            <UploadForm />
        </SubTemplate>
    );
}

export default UploadPostPage;