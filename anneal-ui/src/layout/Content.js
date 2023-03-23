import Home from '../pages/homepage';
import Host from '../pages/host';
import Inventory from '../pages/inventory';
import ProjectForm from '../pages/project/ProjectForm';
import ProjectDetail from '../pages/project/ProjectDetail';
import ProjectTable from '../pages/project';
import Pipeline from '../pages/pipeline';
import { Routes, Route } from 'react-router-dom';

const PageContent = () => {
    return (
        <>
            <Routes>
              <Route
                  path='/'
                  element={<Home />}
              />
              <Route
                  path='/hosts'
                  element={<Host />}
              />
              <Route
                  path='/inventories'
                  element={<Inventory />}
              />
              <Route
                  path='/pipelines'
                  element={<Pipeline />}
              />
              <Route path='/projects'>
                <Route index  element={<ProjectTable />} />
                <Route exact path=':projectId' element={<ProjectDetail />} />
                <Route exact path='new-project' element={<ProjectForm />} />
              </Route>
            </Routes>
        </>
    )
}

export default PageContent;

