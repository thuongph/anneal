import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Form, Input, Modal, Select, Tag } from 'antd';
import { useService } from '../../context/ServiceContext';

const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const displayInventories = (inventories) => {
    return inventories?.map((inventory) => {
        const displayHost = inventory.hosts.length > 0 ? inventory.hosts.map((host) => host.name) : [];
        return {key: inventory._id, name: inventory.name, hosts: displayHost}
    })
}

const buildMapFromArray = (array, key, value) => {
    const map = new Map();
    for (const element of array) {
        map.set(element[key], element[value])
    }
    return map;
}

const Inventory = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [inventories, setInventories] = useState(null);
    const [hosts, setHosts] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [form] = Form.useForm();
    const { Column } = Table;
    const { Option } = Select;
    const { hostService, inventoryService } = useService()

    const [hostMap, setHostMap] = useState(null);

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };
    const createNewInventory = async (inventory) => {
        try {
            setLoading(true);
            const hostsParam = inventory.host.map((host) => hostMap.get(host));
            await inventoryService.createInventory({name: inventory.name, hosts: hostsParam});
            // reload inventories
            const inventories = await inventoryService.getInventories();
            setInventories(displayInventories(inventories));
            closeModal();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    const onFinish = async (values) => {
        await createNewInventory(values)
    };
    const closeModal = () => setOpenAddForm(false);
    
    useEffect(() => {
        const getInventoryList = async () => {
            try {
                setLoading(true);
                const inventories = await inventoryService.getInventories();
                setInventories(displayInventories(inventories, 'name', '_id'));
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin inventories');
            } finally {
                setLoading(false);
            }
        }
        const getHostList = async () => {
            try {
                setLoading(true);
                const hostList = await hostService.getHosts();
                setHostMap(buildMapFromArray(hostList, 'name', '_id'));
                setHosts(hostList);
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin hosts');
            } finally {
                setLoading(false);
            }
        }
        getInventoryList();
        getHostList();
    }, []);

    const handleChange = (val) => {
        console.log(val);
    }

    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <div style={{display: 'flex', float: 'right', padding: '16px 16px 16px 0px'}}>
                    <Button type="primary" size='large' onClick={() => setOpenAddForm(true)}>Thêm nhóm host mới</Button>
                </div>
                <Table dataSource={inventories}>
                    <Column width='30%' title="Tên" dataIndex="name" key="name" />
                    <Column
                        title="Hosts"
                        dataIndex="hosts"
                        key="hosts"
                        render={(hosts) => (
                            <>
                            {hosts?.map((host) => (
                                <Tag color="blue" key={host}>
                                    {host}
                                </Tag>
                            ))}
                            </>
                        )}
                        />
                </Table>
            </div>
            <Modal
                title="Thêm mới nhóm host"
                width={640}
                open={openAddForm}
                onCancel={closeModal}
                footer={[
                    <Button key="back" onClick={closeModal}>
                    Đóng
                    </Button>,
                    <Button form="addInventoryForm" htmlType="submit" key="submit" type="primary" onClick={onFinish}>
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
                    id="addInventoryForm"
                >
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="host" label="Host" rules={[{ required: true }]}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Chọn hosts"
                        onChange={handleChange}
                        optionLabelProp="label"
                    >
                        {hosts?.map((host) => (
                            <Option key={host._id} value={host.name}></Option>
                        ))}
                    </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    );
};

export default Inventory;

