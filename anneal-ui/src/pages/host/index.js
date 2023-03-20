import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const Host = () => {
    const text = "this is host page"
    return (
        <Paragraph>{text}</Paragraph>
    )
}

export default Host;
