import { Flex, Heading, Highlight, Text } from "@chakra-ui/react";
import React from "react";

export const PageTitle = ({ query, title }) => {
    return (
        <Flex direction="column" align="center">
            <Heading size="xl" color="#2C3E50" fontFamily="monospace" mb={2}>
                <Highlight
                    query={query}
                    styles={{ px: '2', py: '1', rounded: 'full', bg: '#F7DC6F', color: '#2C3E50' }}
                >
                    {title}
                </Highlight>
            </Heading>
            <Text fontSize="sm" color="#718096" textAlign="center">
                {query && `Searching for: ${query}`}
            </Text>
        </Flex>
    );
}