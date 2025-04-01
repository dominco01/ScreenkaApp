import { delay, getPath, objectToPermissions, } from "../aFunctions";
import { DEMOFUNNYNAME, UserRepository } from "./aDemobase";
import { UserClass} from "../Objects/User/UserClass";
import { doc, updateDoc, where } from "firebase/firestore";
import { db, getDoc, getDocWhere, getDocs, getUserSrcFromStorage } from "../Services/aFirebase";

export const useUserService = (demo)=> demo ? UserServiceDemo : UserService;

const UserService = {
    getUser: async (fullname) => {
      if (fullname == null) return null;
      if (sessionStorage.getItem("users/" + fullname)) {
        let obj = JSON.parse(sessionStorage.getItem("users/" + fullname));
        return UserClass.fromDoc(obj);
      }
      let doc = await getDoc("users", fullname);
      if(!doc) return null;
      sessionStorage.setItem("users/" + fullname, JSON.stringify(doc));
      let user= UserClass.fromDoc(doc);
      //if (!user.preferences.me) return null;
      return user;
    },
  
    getUserByFunnyname: async (funnyname) => {
      if(!funnyname) return null;
      return getDocWhere("users", "funnyname", funnyname).then(UserClass.fromDoc);
    },

    changeUserPreferences: async(user_fullname,preferences)=>{
      if(user_fullname==null) return null;
      console.log("user "+user_fullname+ " change preferences");

   

      return updateDoc(doc(db, "users", user_fullname), "preferences",preferences).then(()=>{
        if (sessionStorage.getItem("users/" + user_fullname)) {
          let obj = JSON.parse(sessionStorage.getItem("users/" + user_fullname));
          let user = UserClass.fromDoc(obj);
          user.preferences = objectToPermissions(preferences,user.preferences);
          sessionStorage.setItem("users/" + user_fullname, JSON.stringify(user));
        }
      })
    },
  
    trySetUsername: async (fullname, username) => { //return true or false
      if (username == null || username.length <= 3 || username.length > 20) return false;
  
      let user = await UserService.getUser(fullname);
      if (user == null) throw new Error("Wrong your fullname");
      if(!user.hosts || user.hosts.length===0) return false;
      
      let docs = await getDocs(`users`,where("hosts","array-contains-any",user.hosts),where("username","==",user.username))
      if(!docs || docs.length!==0) return false;

      return updateDoc(doc(db, "users", fullname), { username: username }).then(()=>{
        if (sessionStorage.getItem("users/" + fullname)) {
          let obj = JSON.parse(sessionStorage.getItem("users/" + fullname));
          let user = UserClass.fromDoc(obj);
          user.username = username;
          sessionStorage.setItem("users/" + fullname, JSON.stringify(user));
        }
      }).then(()=>true);
    },
  
    trySetPersonalizedApps: async (fullname, apps) => {
      if (fullname == null || apps == null) return false;
      return updateDoc(doc(db, "users", fullname), { personalized_apps: apps }).then(()=>{
        if (sessionStorage.getItem("users/" + fullname)) {
          let obj = JSON.parse(sessionStorage.getItem("users/" + fullname));
          let user = UserClass.fromDoc(obj);
          user.personalized_apps = apps;
          sessionStorage.setItem("users/" + fullname, JSON.stringify(user));
        }
      }).then(()=>true);
    },
  
    getUserSrcUrl: async (user_fullname) => {
      if (user_fullname == null) return null;
  
      let sessionUrl = sessionStorage.getItem(user_fullname + "_src");
      if (sessionUrl) return new Promise((resolve) => resolve(sessionUrl));
  
      return getUserSrcFromStorage(user_fullname).then((url) => {
        sessionStorage.setItem(user_fullname + "_src", url);
        return url;
      }).catch(err=>{if(err.code==='storage/object-not-found') return getPath("default_profile_picture.png"); else throw err;});
    },
};

const UserServiceDemo = {
    getUser: async (fullname) => {
      await delay(1000);
      if (fullname == null) return null;
      return UserRepository.find(
        (user) => user.fullname.toLowerCase() === fullname.toLowerCase()
      );
    },
  
    getUserByFunnyname: async (funnyname) => {
      await delay(1000);
      if (!funnyname) return null;
      return UserRepository.find(
        (user) => user.funnyname.toLowerCase() === DEMOFUNNYNAME.toLowerCase() //wpusci zawsze nie wazne co wpiszesz
      );
    },

    changeUserPreferences: async(user_fullname,preferences)=>{
      console.log("user "+user_fullname+ " change preferences");
      await delay(500);
    },
  
    trySetUsername: async (fullname, username) => { //return true or false
      if (username == null || username.length <= 3 || username.length > 20)
        return false;
  
      let user = await UserServiceDemo.getUser(fullname);
      if (user == null) throw new Error("Wrong your fullname");
  
      //todo
      
      await delay(500); // set
  
      return true;
    },
  
    trySetPersonalizedApps: async (fullname, apps) => {
      await delay(1000); // set
      return true;
    },
  
    getUserSrcUrl: async (user_fullname) => {
      return getPath("default_profile_picture.png");
    },
};
  
  