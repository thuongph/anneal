import React, { useEffect, useState } from 'react';
import { message, Spin, Button, Form, Input, Select, Typography, Checkbox, Row, Col, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

export const TYPE = ['Nodejs', 'Java', 'Khác'];

const style = {
    background: '#fff',
    padding: '12px 16px',
    marginBottom: '16px',
    borderRadius: '32px',
    fontSize: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #95BDFF'
};

export const PipelineVisualize = (props) => {
    const { pipeline } = props;
    const { Title, Text } = Typography;
    return (
        <>
            <Row style={{margin: '64px'}} gutter={[64, 32]}>
                {
                    pipeline.map((stage) => {
                        return (
                            <Col className="job-row" span={24/pipeline.length}>
                                <Title style={{marginBottom: '24px', paddingLeft: '12px'}} level={5}>{stage.name}</Title>
                                {
                                    stage.jobs.length && (
                                        stage.jobs.map((job) => {
                                            return (
                                                <Row style={style}>
                                                    <Text>{job.name + ':    '}<Text code={true}>{job.command}</Text></Text>
                                                </Row>
                                            );
                                        })
                                    )
                                }
                            </Col>
                        );
                    })
                }
            </Row>
        </>
    );
}

export const JobForm = props => {
    return (
      <>
        <Form.List name={[props.name, "jobs"]}>
          {(jobs, { add, remove }) => {
            return (
              <div>
                {jobs.map((job) => (
                  <Space
                    key={job.name}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                        {...job}
                        name={[job.name, 'name']}
                        key={job.name}
                        rules={[
                        {
                            required: true,
                            message: 'Missing job name',
                        },
                        ]}
                    >
                        <Input placeholder="Tên job" />
                    </Form.Item>
                    <Form.Item
                        {...job}
                        name={[job.name, 'command']}
                        key={job.name}
                        rules={[
                        {
                            required: true,
                            message: 'Missing command',
                        },
                        ]}
                    >
                        <Input placeholder="Command" />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(job.name);
                      }}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                  >
                    <PlusOutlined /> Thêm job mới
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </>
    );
  };

const ProjectForm = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const [inventories, setInventories] = useState(null);
    const [inventoriesMap, setInventoriesMap] = useState(null);
    const [form] = Form.useForm();
    const { Option } = Select;
    const { Title } = Typography;
    const navigate = useNavigate();
    const { projectService, inventoryService } = useService();

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

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };
    const onCancel = () =>{
        navigate(-1);
    }

    const createNewProject = async (project) => {
        try {
            setLoading(true);
            console.log({project});
            await projectService.createProject({...project});
            navigate(-1);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onFinish = async (values) => {
        await createNewProject({...values, inventory: inventoriesMap.get(values.inventory)});
    }

    const handleChangeInventory = (value) => {
        console.log(value);
    }

    const handleChangeType = (value) => {
        console.log(value);
    }
    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <Title level={2}>Thêm mới project</Title>
                <Form
                    {...formLayout}
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
                            <Form.Item name="stack" label="Type" rules={[{ required: true }]}>
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
                        </Col>
                        <Col span={2}></Col>
                        <Col span={14}>
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
                                            <PlusOutlined /> Thêm stage mới
                                        </Button>
                                        </>
                                    );
                                }}
                            </Form.List>}
                        </Col>
                    </Row>
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
        </Spin>
    );
}

export default ProjectForm;