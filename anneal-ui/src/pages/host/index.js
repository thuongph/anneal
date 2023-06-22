import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Form, Input, Modal } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useService } from '../../context/ServiceContext';

const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
        title: 'Khóa',
        dataIndex: 'private_key_file',
        key: 'private_key_file',
    },
    {
        title: '',
        key: 'delete_action',
        render: (_, record) => (
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                <DeleteTwoTone onClick={() => console.log(record)} style={{ fontSize: '24px'}} twoToneColor="#eb2f96" />
            </div>
          ),
    },  
];

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const Host = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [hosts, setHosts] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [form] = Form.useForm();
    const { hostService } = useService();

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };
    const createNewHost = async (host) => {
        try {
            setLoading(true);
            await hostService.createHost(host);
            closeModal();
            setHosts([...hosts, host])
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    const onFinish = async (values) => {
        await createNewHost(values)
    };
    const closeModal = () => setOpenAddForm(false);
    
    useEffect(() => {
        const getHostList = async () => {
            try {
                setLoading(true);
                const hostList = await hostService.getHosts();
                setHosts(hostList);
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin hosts');
            } finally {
                setLoading(false);
            }
        }
        getHostList();
    }, []);

    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <div style={{display: 'flex', float: 'right', padding: '16px 16px 16px 0px'}}>
                    <Button type="primary" size='large' onClick={() => setOpenAddForm(true)}>Thêm host mới</Button>
                </div>
                <Table dataSource={hosts} columns={columns} />
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
                    <Button form="addHostForm" htmlType="submit" key="submit" type="primary" onClick={onFinish}>
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
                    id="addHostForm"
                >
                    <Form.Item name="name" label="Tên" rules={[{ required: true }, {
                        validator: (_, value) =>
                            !value.includes(" ")
                            ? Promise.resolve()
                            : Promise.reject(new Error("No spaces allowed"))
                    }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="host" label="Host" rules={[{ required: true }, {
                        validator: (_, value) =>
                            !value.includes(" ")
                            ? Promise.resolve()
                            : Promise.reject(new Error("No spaces allowed"))
                    }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="user_name" label="Tên người dùng" rules={[{ required: true }, {
                        validator: (_, value) =>
                            !value.includes(" ")
                            ? Promise.resolve()
                            : Promise.reject(new Error("No spaces allowed"))
                    }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="private_key_file" label="Khóa" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    );
};

export default Host;
