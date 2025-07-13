import { Heading, Highlight } from "@chakra-ui/react";
import React from "react";

export const PageTitle = ({ query, title }) => {
    return (<Heading lineHeight="tall" textAlign={'center'} mt={6} color="#4A5568">
        <Highlight
            query={query}
            styles={{ px: '2', py: '1', rounded: 'full', bg: '#F7DC6F', color: '#4A5568' }}
        >
            {title}
        </Highlight>
    </Heading>);
}