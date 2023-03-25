import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Space, Typography, Avatar } from 'antd';
import { getPipelines } from '../../api/pipelineService';
import { Link as ReactRouterDomLink} from 'react-router-dom'

export const statusColorMap = {
    fail: '#DC3535',
    pass: '#65C18C',
    pending: '#FFD36E',
}

export const statusStyle = (status) => {
    return {
        padding: '8px',
        borderRadius: '4px',
        fontSize: '13px',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #E4E5F0',
        color: statusColorMap[status],
        fontWeight: '900'
}};

const Pipeline = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [pipelines, setPipelines] = useState();
    const [isLoading, setLoading] = useState(false);
    const { Column } = Table;
    const { Text, Link } = Typography;

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };

    useEffect(() => {
        const getPipelineList = async () => {
            try {
                setLoading(true);
                const pipelines = await getPipelines();
                setPipelines(pipelines);
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin hosts');
            } finally {
                setLoading(false);
            }
        }
        getPipelineList();
    }, []);

    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <Table dataSource={pipelines} style={{width: '64%'}}>
                    <Column align='center' width='20%' title="Trạng thái" dataIndex="status" key="status" render={(_, record) => (
                        <Space key={record._id} style={statusStyle((record.status))}>
                            {record.status.toUpperCase()}
                        </Space>
                    )} />
                    <Column width='50%' title="Commit" dataIndex="commit" key="commit"render={(_, record) => (
                        <Link href={record.head_commit.url} strong>{record.head_commit.message}</Link>
                    )} /> 
                    <Column align='center' width='30%' title="Tác giả" dataIndex="author" key="author" render={(_, record) => (
                        <a href={record.sender.html_url}><Avatar size={48} src={record.sender.avatar_url} /></a>
                    )} />
                    <Column width='50%' title="Pipeline" dataIndex="pipeline" key="pipeline"render={(_, record) => (
                        <ReactRouterDomLink to={`${record._id}`}><Text underline>Chi tiết</Text></ReactRouterDomLink>
                    )} />
                </Table>
            </div>
        </Spin>
    )
}

export default Pipeline;
