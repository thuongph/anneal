import { useContext, createContext } from "react";
import { useAuth } from "./AuthContext";
import { ProjectService } from "../api/projectService";
import { PipelineService } from "../api/pipelineService";
import { InventoryService } from "../api/inventoryService";
import { HostService } from "../api/hostService";

const project_endpoint = '/projects';
const pipeline_endpoint = '/pipelines';
const inventory_endpoint = '/inventories';
const host_endpoint = '/hosts';

const ServiceContext = createContext({
    projectService: null,
    pipelineService: null,
    inventoryService: null,
    hostService: null,

});

export const ServiceProvider = ({children}) => {
    const { user } = useAuth();
    var services = null;
    if (!!user?.accessToken) {
        services = {
            projectService: new ProjectService(user.accessToken, project_endpoint),
            pipelineService: new PipelineService(user.accessToken, pipeline_endpoint),
            inventoryService: new InventoryService(user.accessToken, inventory_endpoint),
            hostService: new HostService(user.accessToken, host_endpoint)
        };
    } 
    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>      
    );
}

export const useService = () => {
    const context = useContext(ServiceContext);
    return context;
};