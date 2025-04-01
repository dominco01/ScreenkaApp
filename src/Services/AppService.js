import { AppClass } from "../Objects/App/AppClass";
import { Apps, BUILDIN_APPS } from "./aLocalbase";

export const useAppService = () => AppService;

const AppService = {
    getApp : (name) => {
        let app = Object.values(Apps).find(app=>app.name===name);
        if(!app) app = AppClass.Default;
        return app;
    },
    getBuildInApps : ()=> BUILDIN_APPS
};
