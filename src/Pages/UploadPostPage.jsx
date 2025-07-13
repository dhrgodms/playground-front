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
        <Tabs variant='soft-rounded' colorScheme='yellow'>
            <TabList bg="#F8F9FA" borderRadius="md" p={1}>
                <Tab
                    _selected={{
                        bg: '#F7DC6F',
                        color: '#4A5568',
                        fontWeight: 'bold'
                    }}
                    color="#4A5568"
                >
                    .md
                </Tab>
                <Tab
                    _selected={{
                        bg: '#F7DC6F',
                        color: '#4A5568',
                        fontWeight: 'bold'
                    }}
                    color="#4A5568"
                >
                    Files
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <MarkdownForm categoryId={3} />
                </TabPanel>
                <TabPanel>
                    <FileForm categoryId={4} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

const UploadPostPage = () => {
    return (
        <SubTemplate titleQuery={"uploadform"} pageTitle={"uploadform"}>
            <UploadForm />
        </SubTemplate>
    );
}

export default UploadPostPage;