import { GET_NOW, datesWeekDelta, delay, } from "../aFunctions";
import { DEMONOW, HostRepository } from "./aDemobase";
import { Host } from "../Objects/Host";
import { getDoc } from "../Services/aFirebase";

export const useHostService = (demo)=> demo ? HostServiceDemo : HostService;

const HostService = {
    getHost: async (id) => {
      if(id==null) return null;
      let doc = await getDoc("hosts", id);
      return Host.fromDoc(doc);
    },

    getCurrentWeekNumber: (host_start_date) => { //dziala na bazie czasu demo. wiec nigdzie indziej byc nie moze
      if (host_start_date == null) return 0;
      return datesWeekDelta(host_start_date, GET_NOW());
    },
};

const HostServiceDemo = {
    getHost: async (id) => {
      if (id === undefined) return undefined;
      await delay(500);
      return HostRepository.find((host) => host.id === id);
    },
  
    getCurrentWeekNumber: (host_start_date) => {
      if (host_start_date == null) return 0;
      return datesWeekDelta(host_start_date, DEMONOW);
    },
};
  
  