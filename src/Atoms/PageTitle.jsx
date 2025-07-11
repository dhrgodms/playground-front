import {Heading, Highlight} from "@chakra-ui/react";
import React from "react";

export const PageTitle =({query,title}) => {
    return(<Heading lineHeight="tall" textAlign={'center'}>
        <Highlight
            query={query}
            styles={{px: '2', py: '1', rounded: 'full', bg: 'green.200'}}
        >
            {title}
        </Highlight>
    </Heading>);
}