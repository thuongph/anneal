import Home from '../pages/homepage';
import Host from '../pages/host';
import Inventory from '../pages/inventory';
import Project from '../pages/project';
import Pipeline from '../pages/pipeline';
import { Routes, Route } from 'react-router-dom';


export const routes = [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/host',
      component: Host,
    },
    {
      path: '/inventory',
      component: Inventory,
    },
    {
      path: '/project',
      component: Project,
    },
    {
      path: '/pipeline',
      component: Pipeline,
    },
];

const PageContent = () => {
    return (
        <>
            <Routes>
                {routes.map((route) => {
                    const RouteCommponent = route.component;
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<RouteCommponent />}
                        />
                    );
                })}
            </Routes>
        </>
    )
}

export default PageContent;

