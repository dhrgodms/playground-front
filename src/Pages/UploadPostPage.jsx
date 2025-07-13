import React from 'react';
import {
    Flex, Box, TabPanel, Tab, TabPanels, TabList, Tabs,
} from '@chakra-ui/react';
import SubTemplate from "../Templates/SubTemplate";
import MarkdownForm from "../Articles/UploadForm/MarkdownForm";
import { FileForm } from "../Articles/UploadForm/FileForm";
function UploadForm() {

    return (
        <SubTemplate titleQuery={"uploadform"} pageTitle={"uploadform"}>
            <Tabs variant='soft-rounded' colorScheme='yellow'>
                <TabList>
                    <Tab>.md</Tab>
                    <Tab>Files</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <MarkdownForm tag={3} />
                    </TabPanel>
                    <TabPanel>
                        <FileForm tag={4} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </SubTemplate>
    );
}

const UploadPostPage = () => {
    return (<Flex justify={'center'}>
        <Box>
            <UploadForm />
        </Box>
    </Flex>);
}
export default UploadPostPage;