import React from 'react';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tabs from 'react-bootstrap/esm/Tabs';
import Tab from 'react-bootstrap/esm/Tab';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';

import { ToDoList, Task } from '../Models/GeneralModels';
import TaskComponent from './TaskComponent';
import { SelectCallback } from 'react-bootstrap/esm/helpers';

export interface ListProps {
    todoLists: ToDoList[],
    showCompleted: boolean,
    activeTodoListFrozen: boolean,

    tabChangeHandler: SelectCallback,

    onClickIcon: (t:Task) => void,
    onClickTask: (t:Task) => void,
    onClickDelete: (t:Task) => void,
    onClickEdit: (t:Task) => void,

    onClickCreateTask: (ev:React.MouseEvent) => void,
}

const ListComponent: React.FunctionComponent<ListProps> = (props:ListProps) => {

    return (
        <>
        <Tabs onSelect={props.tabChangeHandler}
        variant='pills'
        justify
        id="tabs"
        style={{ margin: '1rem' }}>
    {
      props.todoLists.map( (todoList: ToDoList) => 
        <Tab key={todoList._id} eventKey={todoList._id} title={todoList.name}>
          <Card style={{ margin: '1rem', height: '75vh', overflowY: 'auto'}} >
            <Card.Body>
              <ListGroup variant="flush">
                {
                  todoList.tasks.filter((task: Task) => props.showCompleted ? task : task.done === false).map((filteredTask: Task) =>
                    <TaskComponent 
                      key={filteredTask._id}
                      task={filteredTask}
                      isListFrozen={props.activeTodoListFrozen}
                      onClickIcon={ () => props.onClickIcon(filteredTask) }
                      onClickTask={ () => props.onClickTask(filteredTask) }
                      onClickDelete={ () => props.onClickDelete(filteredTask) }
                      onClickEdit={ () => props.onClickEdit(filteredTask) }
                    />
                  )
                }
                <ListGroup.Item style={{padding: '0.25rem 0px'}}>
                  <Button variant="outline-primary" size="sm" block disabled={props.activeTodoListFrozen} onClick={props.onClickCreateTask}>
                    {<FontAwesomeIcon icon={faPlusSquare} />}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>
      )
    }
  </Tabs>
  </>
    )
}

export default ListComponent;
