import React, { useEffect, useState } from 'react';
import { message, Spin, Button, Form, Input, Select, Typography, Checkbox, Row, Col, Space } from 'antd';
import { useParams } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import { useNavigate } from 'react-router-dom';
import { JobForm, PipelineVisualize, STANDARD_PIPELINE, TYPE } from './ProjectForm';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const ProjectUpdate = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const { projectService, inventoryService } = useService();
    const { Title } = Typography;
    const [type, setType] = useState(null);
    const [disabledCheckbox, setDisabledCheckbox] = useState(false);
    const [form] = Form.useForm();
    const { Option } = Select;
    const [useStandardCI, setUseStandardCI] = useState(true);
    const navigate = useNavigate();
    const [inventoriesMap, setInventoriesMap] = useState(null);
    const [inventories, setInventories] = useState(null);

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };

    const onCancel = () =>{
        navigate(-1);
    }

    useEffect(() => {
        if (type === 'Khác') {
            setUseStandardCI(false);
            setDisabledCheckbox(true);
        }
        if (type === 'JS') {
            setDisabledCheckbox(false);
        }
    }, [type])

    useEffect(() => {
        const getInventoryList = async () => {
            try {
                setLoading(true);
                const inventories = await inventoryService.getInventories();
                setInventories(inventories.map((inventory) => { return {_id: inventory._id, name: inventory.name}}));
                setInventoriesMap(new Map(
                    inventories.map(obj => {
                        return [obj.name, obj._id];
                    })
                ));
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin inventories');
            } finally {
                setLoading(false);
            }
        }
        getInventoryList();
    }, [])

    useEffect(() => {
        const getProject = async () => {
            try {
                setLoading(true);
                const project = await projectService.getProjectById(projectId);
                console.log({project})
                setProject({...project, inventory: project.inventory.name});
                setUseStandardCI(project.use_standard_ci)
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin project');
            } finally {
                setLoading(false);
            }
        }
        getProject();
    }, []);

    const handleChangeType = (value) => {
        setType(value);
    }

    const onChangeUseStandardCI = (event) => {
        setUseStandardCI(event.target.checked);
    }

    const handleChangeInventory = (value) => {
        console.log(value);
    }

    const updateProject = async (project) => {
        try {
            setLoading(true);
            console.log({project});
            await projectService.updateProject({...project, use_standard_ci: useStandardCI});
            navigate(-1);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onFinish = async (values) => {
        await updateProject({...values, inventory: inventoriesMap.get(values.inventory), id: projectId});
    }

    return (
        !!project ? (<Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <Title level={2}>Chỉnh sửa project</Title>
                <Form
                    {...formLayout}
                    initialValues={project}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ maxWidth: '100%' }}
                    id="addProjectForm"
                >
                    <Row>
                        <Col span={8}>
                            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="inventory" label="Inventory" >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn Inventory"
                                    onChange={handleChangeInventory}
                                    optionLabelProp="label"
                                >
                                    {inventories?.map((inventory) => (
                                        <Option key={inventory._id} value={inventory.name}></Option>
                                    ))}
                            </Select>
                            </Form.Item>
                            <Form.Item name="repo_url" label="Repo" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn Type"
                                    onChange={handleChangeType}
                                    optionLabelProp="label"
                                >
                                    {TYPE?.map((type) => (
                                        <Option key={type} value={type}></Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item {...tailLayout} name="use_standard_ci">
                                <Checkbox checked={useStandardCI} disabled={disabledCheckbox} onChange={onChangeUseStandardCI}>Sử dụng pipeline mẫu</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                        {!useStandardCI && (<Col span={14}>
                            {<Form.List name="stages">
                                {(fields, { add, remove }) => {
                                    return (
                                        <>
                                        {fields.map((stage) => (
                                            <Space
                                            key={stage.name}
                                            style={{ display: "flex", marginBottom: 8 }}
                                            align="start"
                                            >
                                                <Form.Item
                                                    {...stage}
                                                    name={[stage.name, "name"]}
                                                    key={stage.name}
                                                    rules={[
                                                    { required: true, message: "Missing name" }
                                                    ]}
                                                >
                                                    <Input placeholder="Stage Name" />
                                                </Form.Item>
                                                
                                                <JobForm name={stage.name} />

                                                <MinusCircleOutlined
                                                    onClick={() => {
                                                    remove(stage.name);
                                                    console.log(stage);
                                                    }}
                                                />
                                            </Space>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => { add(); }}
                                            block
                                        >
                                            <PlusOutlined /> Add Stage
                                        </Button>
                                        </>
                                    );
                                }}
                            </Form.List>}
                        </Col>)}
                    </Row>
                    {useStandardCI && <PipelineVisualize pipeline={STANDARD_PIPELINE} />}
                    <Row style={{justifyContent: 'flex-end', columnGap: '16px', marginRight: '96px', marginTop: '32px'}}>
                        <Button size='large' key="back" onClick={onCancel}>
                        Hủy
                        </Button>
                        <Button size='large' form="addProjectForm" htmlType="submit" key="submit" type="primary" onClick={onFinish}>
                        Lưu
                        </Button>
                    </Row>
                </Form>
            </div>
        </Spin>) : null
    );
}

export default ProjectUpdate;