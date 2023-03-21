import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import PageContent from './Content';
import { useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = AntLayout;

const menuItems = [
    {
        label: 'Home',
        key: '/',
    },
    {
        label: 'CI/CD',
        key: 'sub1',
        type: 'group',
        children: [
            {
                label: 'Pipelines',
                key: '/pipeline',
            },
            {
                label: 'Projects',
                key: '/project',
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
                key: '/host',
            },
            {
                label: 'Inventory',
                key: '/inventory',
            },
        ],
    }
]

const Layout = () => {
    const navigate = useNavigate();
    const onClick = (event) => {
        navigate(event.key);
    }
    return (
        <AntLayout>
            <Header style={{background: '#B4E4FF'}}>Anneal</Header>
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