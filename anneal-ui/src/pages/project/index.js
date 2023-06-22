import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Space, Modal } from 'antd';
import { CiCircleTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { useNavigate, Link } from "react-router-dom";
import { useService } from '../../context/ServiceContext';

const ProjectTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const [projects, setProjects] = useState(null);
    const { Column } = Table;
    const { confirm } = Modal;
    const navigate = useNavigate();
    const { projectService } = useService();

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };

    const getProjectList = async () => {
        try {
            setLoading(true);
            const projectList = await projectService.getProjects();
            setProjects(projectList.map((project) => { return {...project, inventory: project.inventory?.name };}));
        } catch (err) {
            console.log(err);
            showErrorMessage('Không lấy được thông tin project');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProjectList();
    }, []);

    const deleteProjectById = async (id) => {
        try {
            setLoading(true);
            await projectService.deleteProject(id);
            await getProjectList();
        } catch(err) {
            console.log(err);
            showErrorMessage('Có lỗi xảy ra, Vui lòng thử lại')
        } finally {
            setLoading(false);
        }
    }

    const showConfirmDeleteProject = (project) => {
        confirm({
            title: `Bạn chắc chắn muốn xóa project ${project.name}?`,
            onOk() {
                deleteProjectById(project._id)
            },
            onCancel() {
              console.log('Cancel');
            },
        });
      };

    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <div style={{display: 'flex', float: 'right', padding: '16px 16px 16px 0px'}}>
                    <Button type="primary" size='large' onClick={() => navigate("new-project")}>Thêm project mới</Button>
                </div>
                <Table dataSource={projects}>
                    <Column title="Dự án" dataIndex="name" key="name" render={(_, record) => (
                        <Space size="middle">
                            <a href={record.repo_url}>{record.name}</a>
                        </Space>
                    )} />
                    <Column title="Inventory" dataIndex="inventory" key="inventory" />
                    <Column title="Stack" dataIndex="stack" key="stack" />
                    <Column title="" dataIndex="active" render={(_, record) => (
                        <Space size="middle">
                            {record.active ? "active" : "inactive"}
                        </Space>
                    )} />
                    <Column title="" dataIndex="action" key="action" render={(_, record) => (
                        <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                            <Link to={`${record._id}`}><CiCircleTwoTone style={{ fontSize: '24px'}} /></Link>
                            <DeleteTwoTone onClick={() => showConfirmDeleteProject(record)} style={{ fontSize: '24px'}} twoToneColor="#eb2f96" />
                        </div>
                    )} />
                </Table>
            </div>
        </Spin>
    );
}

export default ProjectTable;
