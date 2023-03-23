import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Space } from 'antd';
import { Routes, Route, useNavigate, useLocation, matchRoutes } from "react-router-dom";
import ProjectForm from './ProjectForm';
import ProjectDetail from './ProjectDetail';

import { getProjects } from '../../api/projectService';

const ProjectTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
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
                setProjects(projectList.map((project) => { return {name: project.name, repo_url: project.repo_url, inventory: project.inventory, type: project.ci_circle.type, use_standard_ci: project.ci_circle.use_standard_ci };}));
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
                    <Button type="primary" size='large' onClick={() => navigate("new-project")}>Thêm host mới</Button>
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

// const Project = () => {
//     const { pathname } = useLocation();
//     console.log({pathname});
//     return (
//         <div>
//             <Route path='/' element={<ProjectTable />}>
//                 <Route path='/project/:projectId' element={<ProjectDetail />} />
//                 <Route path='/project/new-project' element={<ProjectForm />} />
//             </Route>
//         </div>
//     );
// }

// export default Project;
