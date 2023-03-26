import React from 'react';
import { Layout as AntLayout, Menu, Typography, Avatar } from 'antd';
import PageContent from './Content';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = AntLayout;

const menuItems = [
    {
        label: 'CI/CD',
        key: 'sub1',
        type: 'group',
        children: [
            {
                label: 'Pipelines',
                key: '/pipelines',
            },
            {
                label: 'Projects',
                key: '/projects',
            },
        ],
    },
    {
        label: 'Resources',
        key: 'sub2',
        type: 'group',
        children: [
            {
                label: 'Host',
                key: '/hosts',
            },
            {
                label: 'Inventory',
                key: '/inventories',
            },
        ],
    }
]

const Layout = () => {
    const navigate = useNavigate();
    const onClick = (event) => {
        navigate(event.key);
    }
    const { Title, Text } = Typography;
    const { user } = useAuth();
    return (
        <AntLayout>
            <Header style={{background: '#B4E4FF', display: 'flex', justifyContent: 'space-between'}}>
                <Title level={4} color='#F7C8E0'>Anneal</Title>
                <div style={{ marginRight: '16px'}}>
                    <Avatar
                        style={{ marginRight: '12px'}}
                        size={'48'}
                        icon={<UserOutlined />}
                    />
                    <Text>{user.name}</Text>
                </div>
            </Header>
            <AntLayout style={{height: 'cacl(100vh - 64px)'}}>
                <Sider style={{background: '#fff'}}>
                    <Menu
                        onClick={onClick}
                        style={{ width: 200 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        items={menuItems}
                    />
                </Sider>
                <AntLayout>
                    <Content>
                        <PageContent />
                    </Content>
                    <Footer></Footer>
                </AntLayout>
            </AntLayout>
        </AntLayout>
    )
}

export default Layout;