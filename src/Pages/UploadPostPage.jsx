import React from 'react';
import {Flex, Box, TabPanel, Tab, TabPanels, TabList, Tabs,
} from '@chakra-ui/react';
import SubTemplate from "../Templates/SubTemplate";
import {WriteForm} from "../Articles/UploadForm/WriteForm";
import {ImageForm} from "../Articles/UploadForm/ImageForm";
import MarkdownForm from "../Articles/UploadForm/MarkdownForm";
import {FileForm} from "../Articles/UploadForm/FileForm";
function UploadForm() {

        return (
            <SubTemplate titleQuery={"uploadform"} pageTitle={"uploadform"}>
                <Tabs variant='soft-rounded' colorScheme='yellow'>
                    <TabList>
                        <Tab>글</Tab>
                        <Tab>그림</Tab>
                        <Tab>Markdown</Tab>
                        <Tab>File</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <WriteForm tag={1}/>
                        </TabPanel>
                        <TabPanel>
                            <ImageForm tag={2} />
                        </TabPanel>
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
    return(<Flex justify={'center'}>
        <Box>
            <UploadForm />
        </Box>
    </Flex>);
}
export default UploadPostPage;