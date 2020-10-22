
import React, { FormEvent, useEffect, useState } from 'react';

import './App.css';

import { Task, Task_NotMandatoryId, ToDoList, ToDoList_NotMandatoryId} from './Models/GeneralModels';
import FooterComponent from './Components/FooterComponent';
import ModalsComponent from './Components/ModalsComponent';
import ListComponent from './Components/ListComponent';
import LogInRegisterComponent from './Components/LogInRegisterComponent';
import {listDeleteService, listGetAllService, listPostService, 
        listPutService, listShareService, putTokenInHeader, taskDeleteService, 
        taskPostService, taskPutService} from './Services/main.service';

function App() {
  const dummyTask:Task = {_id: '0', title: '', done: false, type: 'regular', price: 0, description: '', pictureURL: '' };
  const dummyList:ToDoList = {_id:'0', name: '', frozen: false, tasks: [], sharedWith: []};

  const [cachedLists, setCachedLists] = useState([dummyList]);
  const [activeListId, setActiveListId] = useState<string|null>(cachedLists[0]?._id);
  const [isActiveListFrozen, setIsActiveListFrozen] = useState<boolean>(cachedLists[0]?.frozen);
  const [userNameToShareWith, setUserNameToShareWith] = useState<string>('');
  const [listSharedWith, setListSharedWith] =  useState<string[]>(['Vin Diesel', 'Monica', 'Stanislau']);

  const [taskFormData, setTaskFormData] = useState<Task>(dummyTask);
  const [editTaskForm_title, setEditTaskForm_title] = useState<string>('');
  const [editTaskForm_price, setEditTaskForm_price] = useState<number>(0);
  const [editTaskForm_type, setEditTaskForm_type] = useState<string>('');



  const [createNewListName, setCreateNewListName] = useState<string>('');
  
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [showShareListModal, setShowShareListModal] = useState(false);
  
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("authToken") ? true : false);

  function afterLogIn(fetchedLists: ToDoList[]) {
    setCachedLists(fetchedLists);
    setActiveListId(fetchedLists[0]?._id || '0');
    setIsActiveListFrozen(fetchedLists[0]?.frozen || false);
  }

  function onLogIn() {
    setIsLoggedIn(true);
  }

function afterTaskUpdate(responseTask:Task) {
  setCachedLists(prevState => 
    prevState.map(
      todoList => todoList._id === activeListId 
      ? {...todoList, tasks: todoList.tasks.map(
          task => task._id === responseTask._id 
          ? responseTask
          : task)
        }
      : todoList
    )
  );
  setShowEditTaskModal(false);
}

  function toggleDoneTask(_task: Task): void {
    if (isActiveListFrozen) {
      return;
    }
    
    // toggle done
    _task.done = !_task.done;

    // send PUT to BE
    taskPutService(activeListId, _task, afterTaskUpdate);
  };
  
  function ClickTask(_task: Task): void {
    // accordion to subtasks
  };

  function ClickDelete(_task: Task): void {
    
    if (isActiveListFrozen) {
      return;
    }

    function updateCache_task_delete(t:Task): void {
      setCachedLists(prevState => 
        prevState.map(
          todoList => todoList._id === activeListId 
          ? {...todoList, 
                  tasks: todoList.tasks.filter(
                    task => task._id !== _task._id
                  )
            }
          : todoList
        )
      );
    }

    // send DELETE to BE
    taskDeleteService(activeListId, _task._id, (t:Task) => updateCache_task_delete(t));
  }

  function ClickEdit(_task: Task): void {

    if (isActiveListFrozen) {
      return;
    }

    // keep it flat for simplicity
    setTaskFormData(_task);
    setEditTaskForm_title(_task.title);
    setEditTaskForm_price(_task.price);
    setEditTaskForm_type(_task.type);

    setShowEditTaskModal(true);
  }

  function ShareList(ev: FormEvent): void {
    ev.preventDefault();

    function afterListShare(listResponse: ToDoList) {

      setCachedLists(prevState => 
        prevState.map( todoList => 
          todoList._id === listResponse._id 
            ? listResponse
            : todoList
        )
      );
      setShowShareListModal(false);
      setUserNameToShareWith('');
    }

    // send PUT to BE
    listShareService(activeListId, userNameToShareWith, afterListShare);

  }

  function UpdateTask(ev: FormEvent): void {
    ev.preventDefault();

    const updatedTask:Task = {...taskFormData, 
      title: editTaskForm_title,
      type: editTaskForm_type,
      price: editTaskForm_price
    };
    setTaskFormData(updatedTask);

    // send PUT to BE
    taskPutService(activeListId, updatedTask, afterTaskUpdate);
  }

  function CreateNewTaskList(ev: FormEvent):void {
    ev.preventDefault();
    
    const dummyList: ToDoList_NotMandatoryId = {
      name: createNewListName,
      frozen: false,
      tasks: [],
      sharedWith: []
    };

    function afterListPost(listResponse: ToDoList) {
      setCachedLists(
        prevState => { return [...prevState, listResponse] }
      )
      setShowCreateListModal(false);
      setCreateNewListName('');
    }

    // send POST to BE
    listPostService(dummyList, afterListPost);
  }

  function DeleteList(ev:FormEvent):void {
    ev.preventDefault();

    function afterListDelete(id: string|null) {
      setCachedLists(prevState => 
        prevState.filter(
          todoList => todoList._id !== id)
      );
      setShowDeleteListModal(false);
    }

    // send DELETE to BE
    listDeleteService(activeListId, afterListDelete);
  }

  function createTask():void {

    const dummyTask:Task_NotMandatoryId = {title: '', done: false, type: 'regular', price: 0, description: '', pictureURL: '' };

    function afterTaskCreate(task: Task, listId:string|null) {
      setCachedLists(prevState => 
        prevState.map(
          todoList => todoList._id === listId
          ? {...todoList, tasks: [...todoList.tasks, task]
            }
          : todoList
        )
      );
    }

    //do the POST request
    taskPostService(activeListId, dummyTask, afterTaskCreate);
  }

  function tabChangeHandler(_id: string|null) {
    setActiveListId(_id);
    setIsActiveListFrozen(
      cachedLists.filter((list:ToDoList) => list._id === _id ).map((list:ToDoList) => {return list.frozen})[0]
    );
  }

  function toggleActiveListFrozen() {

    let updatedList:ToDoList = cachedLists
      .filter( filterList => filterList._id === activeListId)
      .map( updateList => { return {...updateList, frozen: !updateList.frozen }} )[0];

    function afterListPut(responseList: ToDoList) {
      setCachedLists(prevState => 
        prevState.map(
          list => list._id === responseList._id ? responseList : list
        )
      );
      setIsActiveListFrozen(responseList.frozen);
      setShowCreateListModal(false);
      setCreateNewListName('');
    }  

    // do the PUT request
    listPutService(activeListId, updatedList, afterListPut);
  }

  useEffect(() => {
    if (isLoggedIn) {
      putTokenInHeader();
      listGetAllService(afterLogIn);
    }
  }, [isLoggedIn])
  
  return (
    <>{ 
      isLoggedIn
      ? <>
        <ListComponent 
          todoLists={cachedLists}
          showCompleted={showCompletedTasks}
          activeTodoListFrozen={isActiveListFrozen}
          tabChangeHandler={(key) => tabChangeHandler(key)}
          onClickIcon={toggleDoneTask}
          onClickTask={ClickTask}
          onClickDelete={ClickDelete}
          onClickEdit={ClickEdit}
          onClickCreateTask={() => createTask()}
        />
        <FooterComponent 
          showCompletedTasks={showCompletedTasks}
          isListFrozen={isActiveListFrozen}
          onClickToggleIsListFrozen={()=>{toggleActiveListFrozen()}}
          onClickToggleshowCompletedTasks={()=>{setShowCompletedTasks(!showCompletedTasks)}}
          onClickShowModalDeleteList={()=>{setShowDeleteListModal(true)}}
          onClickShowModalCreateList={()=>{setShowCreateListModal(true)}}
          onClickShowModalShareList={()=>{setShowShareListModal(true)}}
        />
        <ModalsComponent 
            showCreateListModal={showCreateListModal}
            valueCreateListModal={createNewListName}
            toggleShowCreateListModal={() => {setShowCreateListModal(false)}}
            onSubmitCreateListModal={(ev) => {CreateNewTaskList(ev)}}
            onChangeCreateListModal={setCreateNewListName}

            showDeleteTaskModal={showDeleteListModal}
            toggleShowDeleteListModal={() => setShowDeleteListModal(false)}
            onSubmitDeleteListModal={DeleteList}

            showEditTaskModal={showEditTaskModal}
            editTaskFormTitle={editTaskForm_title}
            editTaskFormPrice={editTaskForm_price}
            editTaskFormType={editTaskForm_type}
            toggleShowEditTaskModal={() => setShowEditTaskModal(false)}
            onSubmitEditTaskModal={(ev) => {UpdateTask(ev)}}
            onChangeEditTaskTitleModal={setEditTaskForm_title}
            onChangeEditTaskPriceModal={setEditTaskForm_price}
            onChangeEditTaskTypeModal={setEditTaskForm_type}

            showShareListModal={showShareListModal}
            shareListModalForm_username={userNameToShareWith}
            shareListModalForm_currentlySharedWith={listSharedWith}
            toggleShowShareListModal={() => setShowShareListModal(false)}
            onSubmitShareListModal={(ev) => {ShareList(ev)}}
            onChangeShareListModal={setUserNameToShareWith}
        />
      </>
      : <LogInRegisterComponent onLogIn={onLogIn} /> 
    }</>
  );
}

export default App;
