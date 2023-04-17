import Host from '../pages/host';
import Inventory from '../pages/inventory';
import ProjectForm from '../pages/project/ProjectForm';
import ProjectDetail from '../pages/project/ProjectDetail';
import ProjectTable from '../pages/project';
import Pipeline from '../pages/pipeline';
import PipelineDetail from '../pages/pipeline/PipelineDetail';
import ProjectUpdate from '../pages/project/ProjectUpdate';
import { Routes, Route } from 'react-router-dom';

const PageContent = () => {
    return (
        <>
            <Routes>
              <Route
                  path='/'
                  element={<Pipeline />}
              />
              <Route
                  path='/hosts'
                  element={<Host />}
              />
              <Route
                  path='/inventories'
                  element={<Inventory />}
              />
              <Route path='/pipelines'>
                <Route index  element={<Pipeline />} />
                <Route exact path=':pipelineId' element={<PipelineDetail />} />
              </Route>
              <Route path='/projects'>
                <Route index  element={<ProjectTable />} />
                <Route path=':projectId'>
                  <Route index  element={<ProjectDetail />} />
                  <Route exact path='update' element={<ProjectUpdate />} />
                </Route>
                <Route exact path='new-project' element={<ProjectForm />} />
              </Route>
            </Routes>
        </>
    )
}

export default PageContent;

