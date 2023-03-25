import React, { useEffect, useState } from 'react';
import { message, Spin, Typography, Space } from 'antd';
import { getPipelineById } from '../../api/pipelineService';
import { useParams } from 'react-router-dom';
import { statusStyle } from './index';


const PipelineDetail = () => {
    const [pipeline, setPipeline] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { pipelineId } = useParams();
    const { Title, Text, Paragraph } = Typography;

    console.log({pipelineId});

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };

    useEffect(() => {
        const getPipeline = async () => {
            try {
                setLoading(true);
                const pipeline = await getPipelineById(pipelineId);
                console.log({pipeline});
                setPipeline(pipeline);
            } catch(err) {
                showErrorMessage('Không lấy được thông tin pipeline');
            } finally {
                setLoading(false);
            }
        }
        getPipeline();
    }, []);

    return (
        (!!pipeline) ?(<Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
                    <Space style={statusStyle((pipeline.status))}>
                        {pipeline.status.toUpperCase()}
                    </Space>
                    <a href={pipeline.head_commit.url} target='_blank' rel="noreferrer"><Title level={2}>{pipeline.head_commit.message}</Title></a>
                    {/* <a href={pipeline.sender.html_url}><Avatar size={48} src={pipeline.sender.avatar_url} /></a> */}
                </div>
                <div style={{paddingLeft: '32px', paddingTop: '48px'}}>
                {
                    pipeline.result.map((result) => {
                        return (
                            <div style={{paddingBottom: '24px'}}>
                                <Text strong code>{result.cmd}</Text>
                                <div style={{paddingLeft: '24px'}}>
                                    {result.stderr_lines.filter((line) => !!line).length ? (
                                        <Paragraph>
                                            <pre>{result.stderr_lines.join('\n')}</pre>
                                        </Paragraph>
                                    ): null}
                                    {result.stdout_lines.filter((line) => !!line).length ? (
                                        <Paragraph>
                                            <pre>{result.stdout_lines.filter((line) => !!line).join('\n')}</pre>
                                        </Paragraph>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })
                }
                </div>
            </div>
        </Spin>) : null
    );
}

export default PipelineDetail;