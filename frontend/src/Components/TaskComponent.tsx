import React from 'react';

import { Task } from '../Models/GeneralModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare, IconDefinition, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import ListGroup from 'react-bootstrap/esm/ListGroup';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

export interface TaskProps {
    task: Task,
    isListFrozen: boolean,
    onClickIcon: (ev:React.MouseEvent) => void,
    onClickTask: (ev:React.MouseEvent) => void,
    onClickDelete: (ev:React.MouseEvent) => void,
    onClickEdit: (ev:React.MouseEvent) => void,
}

const TaskComponent: React.FunctionComponent<TaskProps> = (props: TaskProps) => {

    const task: Task = props.task;
    const checkBox: IconDefinition = task.done ? faCheckSquare : faSquare;

    const iconStyle = {marginRight: '0.5rem', fontSize: '1rem', color: props.isListFrozen ? 'dimGray' : 'inherit'};
    const conditionalColorStyle = {color: props.isListFrozen ? 'dimGray' : 'inherit'};

    return (
        <ListGroup.Item style={{padding: '0.25rem 0px'}}>
            <Container fluid={true}>
                <Row>
                    <Col xs={1}
                         onClick={props.onClickIcon}>
                        {<FontAwesomeIcon
                          style={{marginRight: '0.5rem',
                                  fontSize: '1.25rem',
                                  color: props.isListFrozen ? 'dimGray' : 'inherit' }}
                          icon={checkBox} />}
                    </Col>
                    <Col xs={7} sm={8}  
                         onClick={props.onClickTask}>
                        <div style={conditionalColorStyle}>
                            {task.title || '<empty>' }
                        </div>
                    </Col>
                    <Col xs={1} 
                         onClick={props.onClickDelete}>
                    {<FontAwesomeIcon
                          style={iconStyle}
                          icon={faTrashAlt} />}
                    </Col>
                    <Col xs={1}
                         onClick={props.onClickEdit}>
                    {<FontAwesomeIcon
                          style={iconStyle}
                          icon={faPen}/>}
                    </Col>
                </Row>
                <Row>
                <Col xs={1}></Col>
                <Col onClick={props.onClickTask}>
                    <div style={conditionalColorStyle}>
                        <div className="text-muted" style={{fontSize: '0.75rem',}}>
                            {task.price ? task.price+' $' : '' }
                        </div>
                    </div>
                </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    );
}

export default TaskComponent;