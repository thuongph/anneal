import React, { useEffect, useState } from 'react';
import { message, Spin, Button, Form, Input } from 'antd';
import { getProjectById } from '../../api/projectService';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const ProjectDetail = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const [form] = Form.useForm();

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };
    return (
        <Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
            </div>
        </Spin>
    );
}

export default ProjectDetail;