import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Form, Input, Modal, Select, Tag } from 'antd';

const Pipeline = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [pipelines, setPipelines] = useState();
    const [isLoading, setLoading] = useState(false);
    const { Column } = Table;

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
                <Table dataSource={pipelines}>
                    <Column width='20%' title="Trạng thái" dataIndex="status" key="status" />
                    <Column width='50%' title="Pipeline" dataIndex="pipeline" key="pipeline" />
                    <Column width='20%' title="Tác giả" dataIndex="author" key="author" />
                </Table>
            </div>
        </Spin>
    )
}

export default Pipeline;
