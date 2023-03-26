import React, { useEffect, useState } from 'react';
import { message, Spin, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { STANDARD_PIPELINE, PipelineVisualize } from './ProjectForm';
import { PipelineTable } from '../pipeline/index';
import { useService } from '../../context/ServiceContext';


const ProjectDetail = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const [pipelines, setPipelines] = useState(null);
    const { projectId } = useParams();
    const { Title, Link } = Typography;
    const { projectService } = useService();

    const showErrorMessage = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
    };

    useEffect(() => {
        const getProject = async () => {
            try {
                setLoading(true);
                const project = await projectService.getProjectById(projectId);
                setProject(project);
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin project');
            } finally {
                setLoading(false);
            }
        }
        const getPipelines = async () => {
            try {
                setLoading(true);
                const pipelines = await projectService.getPipelineByProjectId(projectId);
                setPipelines(pipelines);
            } catch (err) {
                console.log(err);
                showErrorMessage('Không lấy được thông tin pipelines');
            } finally {
                setLoading(false);
            }
        }
        getPipelines();
        getProject();
    }, []);

    return (
        !!project ? (<Spin tip="Loading" size="large" spinning={isLoading}>
            <div className='content' style={{width: '95%', paddingTop: '16px'}}>
                {contextHolder}
                <div style={{paddingBottom: '32px'}}>
                    <Link href={project.repo_url}><Title>{project.name}</Title></Link>
                    <br></br>
                    <div style={{paddingLeft: '24px'}}>
                    <Title level={5}>{ `Inventory: ${project.inventory.name}`}</Title>
                    <Title level={5}>{`Sử dụng Pipeline mặc định: ${project.use_standard_ci ? 'yes' : 'no'}`}</Title>
                    <br></br>
                    <Title level={4}>Pipeline</Title>
                    {
                        project.use_standard_ci ? (
                            <PipelineVisualize pipeline={STANDARD_PIPELINE} />
                        ) : (
                            project.stages.length ? (
                                <PipelineVisualize pipeline={project.stages} />
                            ) : null
                        )
                    }
                    </div>
                </div>
                <br></br>
                {
                    !!pipelines ? (
                        <PipelineTable pipelines={pipelines} />
                    ) : null
                }
            </div>
        </Spin>) : null
    );
}

export default ProjectDetail;