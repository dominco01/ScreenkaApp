import { GET_NOW, YY_MMDD_HHMM, dateToWeekDay, dayEqual, delay, getMonday, getPath, randomElement, weekEqual, } from "../aFunctions";
import { DEMONOW, PostRepositoryMap } from "./aDemobase";
import { PostClass } from "../Objects/Post/PostClass";
import { doc, updateDoc , arrayUnion, increment, setDoc, orderBy, where, limit} from "firebase/firestore";
import { db, getDoc, getDocs, getPostContentSrcFromStorage, storage} from "../Services/aFirebase";
import { ref, uploadBytes } from "firebase/storage";

export const usePostService = (demo)=> demo ? PostServiceDemo : PostService;

const PostService = {

    getPost: async (user_fullname, id) => {
      let doc = await getDoc(`users/${user_fullname}/posts`, id);
      let post =  PostClass.fromDoc(doc);
      if(!post.permissions.me) return null
      return post;
    },
    getPostAndTrySetView: async (user_fullname, id,view_fullname=null) => {
      if(!user_fullname || !id) return null;
      let doci = await getDoc(`users/${user_fullname}/posts`, id);
      let post = PostClass.fromDoc(doci);
      if(!post.permissions.me) return null;
      if(!view_fullname) return post;
      if(post!=null && user_fullname!==view_fullname && post.view==null ) {
        await updateDoc(doc(db, `users/${user_fullname}/posts`, id), {
          view: view_fullname,
        });
        post.view = view_fullname;
      }
      return post;
    },

    getUserCurrentDayRandomPost: async (user_fullname,host_id,forFriends=null,okApps=[]) => {//today post
      if(user_fullname==null || host_id==null) return null;
      let aaaa = GET_NOW()
      aaaa.setHours(0,0,0,0);
      let fromDate = aaaa;
      let toDate = GET_NOW();

      let queries = [where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("host_id","==",host_id),where("permissions.me","==",true)]
      if(forFriends!==null) queries.push(where("permissions.friends","==",forFriends));
      if(okApps && okApps.length>0) queries.push(where("app","in",okApps));
      let docs = await getDocs(`users/${user_fullname}/posts`,...queries,limit(10));
      let doc = randomElement(docs);
      return PostClass.fromDoc(doc);
    },

    getUserLatestPost: async (user_fullname,host_id,forFriends,okApps=[]) => {
      if(user_fullname==null || host_id==null) return null;
      let docs = await getDocs(`users/${user_fullname}/posts`,where("host_id","==",host_id),orderBy("upload_date","desc"),limit(1));
      let post = PostClass.fromDoc(docs?.at(0)); 
      if(!post.permissions.me) return null;
      if(forFriends && !post.permissions.friends) return null;
      if(!okApps.includes(post.app)) return null;
      return post
    },

    getPostTicketsUsed:async(user_fullname,host_id)=>{
      return PostService.getUserCurrentDayPosts(user_fullname,host_id,true).then(posts=>posts.length)
    },

    getUserCurrentDayPosts: async (user_fullname,host_id,forScreenka=null) => { //czesciowo host_id jest uzywne, dla postow z dnia jest muli-host rezultat
      if(!user_fullname) return [];
      let fromDate =new Date(GET_NOW().setHours(0,0,0,0))
      let toDate = GET_NOW();

      let queries = [where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("permissions.me","==",true)]
      if(host_id) queries.push(where("host_id","==",host_id))
      if(forScreenka!==null) queries.push(where("permissions.screenka","==",forScreenka))
      queries.push(orderBy("upload_date"),limit(20));

      let docs= await getDocs(`users/${user_fullname}/posts`,...queries);
      return docs? docs.map((doc) => PostClass.fromDoc(doc)) : [];
    },

    getUserCurrentWeekPosts: async (user_fullname,host_id) => {
      if (user_fullname == null) return null;
  
      let queries;
      let fromDate =getMonday(), toDate = GET_NOW();
      queries = [where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("permissions.me","==",true)];
      if(host_id!==null) queries.push(where("host_id","==",host_id))
      queries.push(orderBy("upload_date"),limit(30));
      let docs = await getDocs(`users/${user_fullname}/posts`,...queries);
      return docs? docs.map((doc) => PostClass.fromDoc(doc)):[];
    },

    getUserPastWeekPosts: async (user_fullname, week_name,host_id=null,forFriends=true,okApps=[], no_view=false)=> {
      if (user_fullname == null || week_name==null) return null;
  
      let queries;
      if(week_name) queries = [where("week_name","==",week_name)]; 
      //
      //wertowanie po "week_name" 
      //ale my sie nie przejmujemy postami z nullem (mimo ze sa podczas tego tygodnia, tylko ze za wczesnie), bedzie ich malo,
      //zakladamy ze week jest zawsze, a eventy oparte o tygodniu tylko wertuja po post.week_name no to niech sie lapia do weeka nie.
      // 
      if(host_id!==null) queries.push(where("host_id","==",host_id))
      queries.push(where("permissions.me","==",true));
      if(forFriends) queries.push(where("permissions.friends","==",true));
      if(no_view) queries.push(where("view","==",null));
      if(okApps && okApps.length>0) queries.push(where("app","in",okApps));
      queries.push(orderBy("upload_date"),limit(30));

      let docs = await getDocs(`users/${user_fullname}/posts`,...queries);
      return docs? docs.map((doc) => PostClass.fromDoc(doc)):[];
    },

    getUserYesterdayRandomPost:async(user_fullname,host_id=null)=>{
      if(!user_fullname) return null;
      const fromDate = GET_NOW();
      fromDate.setDate(fromDate.getDate()-1 );
      fromDate.setHours(0,0,0,0);
      let toDate = new Date(fromDate.getTime());
      toDate.setHours(23,59,59);

      let queries = [where("upload_date",">=",fromDate),where("upload_date","<=",toDate),where("permissions.me","==",true)]
      if(host_id) queries.push(where("host_id","==",host_id));
      let docs = await getDocs(`users/${user_fullname}/posts`,...queries,limit(10));
      let doc = randomElement(docs);
      return PostClass.fromDoc(doc);
    },
  
    getPathPostContentUrl: async (user_fullname, content) => {
      if (content == null) return null;
  
      let sessionUrl = sessionStorage.getItem(content);
      if (sessionUrl) return new Promise((resolve) => resolve(sessionUrl));
  
      return getPostContentSrcFromStorage(user_fullname, content).then((url) => {
        sessionStorage.setItem(content, url);
        return url;
      }).catch(err=>{if(err.code==='storage/object-not-found') return getPath("no_picture.png"); else throw err;});
    },

    changePostPermissions: async(user_fullname,post_id, permissions)=>{
      if(!user_fullname || !post_id) return null;
      console.log("post "+post_id+ " change permissions");
      let res = {}
      if(permissions.me!=null) res["permissions.me"] = permissions.me;
      if(permissions.friends!=null) res["permissions.friends"] = permissions.friends;
      if(permissions.screenka!=null) res["permissions.screenka"] = permissions.screenka;
      return updateDoc(doc(db, "users", user_fullname, "posts", post_id), res);
    },
  
    postPost: async (user_fullname, post, file = null) => { //returns id or error
        const checkUploadPost = async ()=>{
          if (!post?.content) throw new Error("No content");
          if(!post.permissions.me) throw new Error("No pemissions");

          let recent = localStorage.getItem("recent_upload_date")
          if(recent === YY_MMDD_HHMM(post.upload_date)) throw new Error("Wait 1 minute before next upload...");
          localStorage.setItem("recent_upload_date",YY_MMDD_HHMM(post.upload_date))
        }

        const uploadFile = async () => {
            if (file == null) return Promise.resolve();
            if (file.size > 4e6) throw new Error("Please upload a file smaller than 4MB");
            let secure_filename = YY_MMDD_HHMM(post.upload_date)+ ( post.context ? ("_"+ post.context.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0,25)):"")
            post.content = secure_filename;
            let fileRef = ref(storage, user_fullname + "/" + secure_filename);
        
            return uploadBytes(fileRef, file);
        };

        const uploadPost = async () => {
            let postName = YY_MMDD_HHMM(post.upload_date);//= (new Date(2100, 0, 0).valueOf() - post.upload_date.valueOf()).toString();
            res = postName;
            return setDoc(doc(db, "users", user_fullname, "posts", postName), post.toDoc());
        };
          
          const updateWeek = async () => {
            let host_id = post.host_id, week_name = post.week_name;
            
            if(host_id==null || !week_name) return Promise.resolve();
            if(!post.permissions.friends && !post.permissions.screenka) return Promise.resolve(); //if only me.
            
            let data = {};
            data['latest_post'] = {user:user_fullname,date:GET_NOW()}
            data[`day_participants.${dateToWeekDay(GET_NOW())}`] = arrayUnion(user_fullname);
            data[`day_apps_counts.${dateToWeekDay(GET_NOW())}.${post.app}`] = increment(1);
            
            return updateDoc(doc(db, "hosts", host_id, "weeks", week_name), data);
        };
          
        var res = null;
        return checkUploadPost().then(uploadFile).then(uploadPost).then(updateWeek).then(()=>res);
      },
    };

const PostServiceDemo = {
    getPost: async (user_fullname, id) => {
        await delay(1000);
        return PostRepositoryMap.get(user_fullname).find((post) => post.id === id);
    },
    getPostAndTrySetView: async (user_fullname, id,view) => {
      await delay(1000);
      let post = PostRepositoryMap.get(user_fullname).find((post) => post.id === id);
      return post;
    },

    getUserCurrentDayRandomPost: async (user_fullname,host_id,forFriends=null,okApps=[]) => {
      let posts = await PostServiceDemo.getUserCurrentDayPosts(user_fullname,null);
      if(!posts) return null;
      posts.sort(() => 0.5 - Math.random());
      return posts?.at(0);
    },

    getUserLatestPost: async (user_fullname,host_id,okApps=[]) => {
        let posts = await PostServiceDemo.getUserCurrentDayPosts(user_fullname);
        posts?.sort((a, b) => a.upload_date - b.upload_date);
        return posts?.[0];
    },
    
    getPostTicketsUsed:async(user_fullname,host_id)=>{
      return (await PostServiceDemo.getUserCurrentDayPosts(user_fullname,null)).filter(post=>post.permissions.screenka===true).length;
    },

    getUserCurrentDayPosts: async (user_fullname,host_id,forScreenka) => {//narazie bez
        await delay(500);
        if (user_fullname == null) return [];
        return PostRepositoryMap.get(user_fullname)?.filter((post) => dayEqual(post.upload_date, DEMONOW)).filter(post=>post.permissions.me === true).sort((a, b) => b.upload_date- a.upload_date);
      },
 
    getUserCurrentWeekPosts: async (user_fullname,host_id) => { //narazie bez
      if(!user_fullname) return null;
      return PostRepositoryMap.get(user_fullname)?.filter((post) => weekEqual(post.upload_date, DEMONOW)).filter(post=>post.permissions.me === true && post.host_id === host_id);
    },
    
    getUserPastWeekPosts: async (user_fullname, week_name,host_id=null,forFriends,okApps=[],no_view)=> {
        await delay(1000);
        if (user_fullname == null || host_id == null || week_name==null) return null;
        return PostRepositoryMap.get(user_fullname)?.filter((post) => post.host_id === host_id && post.week_name === week_name);
    },

    getUserYesterdayRandomPost:async(user_fullname,host_id)=>{
      await delay(500);
      return null;
    },
    
    getPathPostContentUrl: async () => {
        return getPath("no_picture.png");
    },

    changePostPermissions: async(user_fullname,post_id, permissions)=>{
      if(!user_fullname || !post_id) return null;
        await delay(200);
    },
    
    postPost: async (user_fullname, post, file = null) => {//return id or error
        const uploadFile = async () => {
        if (file == null) return Promise.resolve();
        if (file.size > 4e6) throw new Error("Please upload a file smaller than 4MB");
        return Promise.resolve();
        };
    
        const uploadPost = async () => {
          let postName = YY_MMDD_HHMM(post.upload_date);
          res = postName;
          return Promise.resolve();
        };
    
        const updateWeek = async () => {
        return Promise.resolve();
        };
        
        var res= null;
        if (!post?.content) throw new Error();
        await delay(1000);
        return uploadFile().then(uploadPost).then(updateWeek).then(()=>res);
    },
};
      