import axios from 'axios';
import { Task, Task_NotMandatoryId, ToDoList, ToDoList_NotMandatoryId } from '../Models/GeneralModels';

const baseUrl = "http://localhost:3001";

const errorHandler = (service: string, err: Object) => {
    // well, there's not much currently
    console.error(service+': '+err);
}

const storeToken = (token: string) => {
    sessionStorage.setItem("authToken", token);
    putTokenInHeader();
}

const putTokenInHeader = () => {
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("authToken");
}

const forgetToken = () => {
    sessionStorage.removeItem("authToken");
    axios.defaults.headers.common['Authorization'] = '';
}

// USER
    // login
    function logInService(loginData: Object, successCallback: ()=>void, failCallback: (s:string|null)=>void) {
        axios.put(baseUrl+"/api/user/login", loginData)
        .then(res => {
            if (res.data.status === 'OK') {
                storeToken(res.data.token);
                successCallback();
            } else {
                errorHandler('USER Login',res);
            }
        }).catch(err => {
            errorHandler('USER Login',err);
            failCallback(err.response.data.error_message);
        })
    };

    // logout
    function logOutService() {
        forgetToken();
    };

    // register
    function registerService(registerData: Object, successCallback: () => void, failCallback: (s:string|null) => void) {
        axios.post(baseUrl+"/api/user/register",registerData)
        .then(res => {
            storeToken(res.data.token);
            successCallback();
        }).catch( err => {
            errorHandler('USER Register',err);
            failCallback(err.response.data.error_message);
        })
    };

// TASK
    // put
    const taskPutService = (listId: string|null, task: Task, updateCache: (t: Task) => void ) => {
        axios.put(baseUrl+"/api/task/"+listId+'/'+task._id, task)
            .then(res => {
                const responseTask:Task = res.data;
                updateCache(responseTask);
            }).catch( err => {
                errorHandler('Task Put',err);
            });
    };

    // get
    // (...)

    // post
    const taskPostService = (listId: string|null, task: Task_NotMandatoryId, updateCache: (t: Task, listId:string|null) => void) => {
        axios.post(baseUrl+"/api/task/"+listId, task)
        .then(res => {
            const responseTask: Task = res.data;
            updateCache(responseTask, listId);
        }).catch(err => {
            errorHandler('Task Put',err);
        });
    };

    // delete
    const taskDeleteService = (listId: string|null, taskId:string , updateCache: (t: Task) => void ) => {
        axios.delete(baseUrl+"/api/task/"+listId+'/'+taskId)
        .then(res => {
            const taskResponse: Task = res.data;
            updateCache(taskResponse);
        }).catch(err => {
            errorHandler('TASK Delete', err);
        });
    };

// LIST
    // share
    const listShareService = (listId: string|null, userName:string , updateCache: (l: ToDoList) => void) => {
        axios.put(baseUrl+"/api/list/share/"+listId+"/"+userName)
        .then(res => {
            const responseList:ToDoList = res.data;
            updateCache(responseList);
        }).catch(err => {
            errorHandler('LIST Share', err);
        });
    };

    // put
    const listPutService = (listId: string|null, list: ToDoList, updateCache: (l: ToDoList) => void) => {
        axios.put(baseUrl+"/api/list/"+listId, list)
        .then(res => {
            const responseList:ToDoList = res.data;
            updateCache(responseList);
        }).catch(err => {
              console.log(err);
        });
    }

    // get ALL
    const listGetAllService = (successCallback: (l: ToDoList[]) => void ) => {
        axios.get(baseUrl+"/api/list/all")
        .then(res => {
            let responseLists:ToDoList[] = res.data;
            successCallback(responseLists);
        }).catch(err => {
            errorHandler('LIST GetAll', err);
        });
    };
    // post
    const listPostService = (newList:ToDoList_NotMandatoryId, updateCache: (l: ToDoList) => void ) => {
        axios.post(baseUrl+"/api/list", newList)
        .then(res => {
            const responseList:ToDoList = res.data
            updateCache(responseList);
        }).catch(err => {
            errorHandler('LIST Post', err);
        });
    };
    // delete
    const listDeleteService = (listId:string|null, updateCache: (id: string|null) => void) => {
        axios.delete(baseUrl+"/api/list/"+listId)
        .then(res => {
            updateCache(listId);
        }).catch(err => {
            errorHandler('LIST Delete', err);
        });
    };

export {
    taskDeleteService, 
    taskPutService,
    taskPostService,
        
    logInService,
    logOutService,
    registerService,
    
    listGetAllService,
    listShareService,
    listPostService,
    listDeleteService,
    listPutService,

    putTokenInHeader

};