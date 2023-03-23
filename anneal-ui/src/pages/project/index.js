import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Space } from 'antd';
import { useNavigate } from "react-router-dom";

import { getProjects } from '../../api/projectService';

const ProjectTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const [projects, setProjects] = useState(null);
    const { Column } = Table;
    const navigate = useNavigate();

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };

    useEffect(() => {
        const getProjectList = async () => {
            try {
                setLoading(true);
                const projectList = await getProjects();
                setProjects(projectList.map((project) => { return {...project, inventory: project.inventory.name, use_standard_ci: project.use_standard_ci ? 'yes' : 'no' };}));
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin project');
            } finally {
                setLoading(false);
            }
        }
        getProjectList();
    }, []);

    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <div style={{display: 'flex', float: 'right', padding: '16px 16px 16px 0px'}}>
                    <Button type="primary" size='large' onClick={() => navigate("new-project")}>Thêm project mới</Button>
                </div>
                <Table dataSource={projects}>
                    <Column title="Tên" dataIndex="name" key="name" render={(_, record) => (
                        <Space size="middle">
                            <a href={record.repo_url}>{record.name}</a>
                        </Space>
                    )} />
                    <Column title="Inventory" dataIndex="inventory" key="inventory" />
                    <Column title="stack" dataIndex="type" key="type" />
                    <Column title="Sử dụng CI/CD mặc định" dataIndex="use_standard_ci" key="use_standard_ci" />
                </Table>
            </div>
        </Spin>
    );
}

export default ProjectTable;
