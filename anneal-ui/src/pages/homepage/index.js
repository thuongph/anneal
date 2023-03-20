import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const Home = () => {
    const text = "this is home"
    return (
        <Paragraph>{text}</Paragraph>
    )
}

export default Home;
