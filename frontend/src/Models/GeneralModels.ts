export interface Task {
    _id: string,
    title: string,
    type: string,
    subTasks?: string, // _id of a List,
    done: boolean,
    price: number,
    description: string,
    pictureURL: string
}

export interface Task_NotMandatoryId {
    _id?: string,
    title: string,
    type: string,
    subTasks?: string, // _id of a List
    done: boolean,
    price: number,
    description: string,
    pictureURL: string
}

export interface ToDoList {
    _id: string,
    name: string,
    frozen: boolean,
    tasks: Task[],
    sharedWith: string[]
}

export interface ToDoList_NotMandatoryId {
    _id?: string,
    name: string,
    frozen: boolean,
    tasks: Task[],
    sharedWith: string[]
}


