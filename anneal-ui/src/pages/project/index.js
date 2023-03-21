import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Form, Input, Modal, Space } from 'antd';

import { getProjects } from '../../api/projectService';

const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
        title: 'Inventory',
        dataIndex: 'inventory',
        key: 'inventory',
    },
    {
      title: 'Stack',
      dataIndex: 'type',
      key: 'tyoe',
    },
    {
      title: 'Sử dụng CI/CD mặc định',
      dataIndex: 'use_standard_ci',
      key: 'use_standard_ci',
    },   
];

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const ProjectTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [projects, setProjects] = useState(null);
    const [form] = Form.useForm();
    const { Column } = Table;

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };
    const closeModal = () => setOpenAddForm(false);

    const onFinish = async (values) => {
        await console.log(values)
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
                    <Button type="primary" size='large' onClick={() => setOpenAddForm(true)}>Thêm host mới</Button>
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
            <Modal
                title="Thêm mới host"
                width={640}
                open={openAddForm}
                onCancel={closeModal}
                footer={[
                    <Button key="back" onClick={closeModal}>
                    Đóng
                    </Button>,
                    <Button form="addProjectForm" htmlType="submit" key="submit" type="primary" onClick={onFinish}>
                    Lưu
                    </Button>,
                ]}
            >
                <Form
                    {...formLayout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                    id="addProjectForm"
                >
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="host" label="Host" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="user_name" label="Tên người dùng" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="private_key_file" label="Khóa" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    );
}

export default ProjectTable;
