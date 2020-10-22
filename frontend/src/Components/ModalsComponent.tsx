import React from 'react';

import Modal from 'react-bootstrap/esm/Modal';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';

export interface ModalProps {
    showCreateListModal: boolean,
    valueCreateListModal: string,
    toggleShowCreateListModal: (ev:React.MouseEvent) => void,
    onSubmitCreateListModal: (ev:React.FormEvent) => void,
    onChangeCreateListModal: (ev:React.SetStateAction<string>) => void,

    showDeleteTaskModal: boolean,
    toggleShowDeleteListModal: (ev:React.MouseEvent) => void,
    onSubmitDeleteListModal: (ev:React.FormEvent) => void,

    showEditTaskModal: boolean,
    editTaskFormTitle: string,
    editTaskFormPrice: number,
    editTaskFormType: string,
    toggleShowEditTaskModal: (ev:React.MouseEvent) => void,
    onSubmitEditTaskModal: (ev:React.FormEvent) => void,
    onChangeEditTaskTitleModal: (ev:React.SetStateAction<string>) => void,
    onChangeEditTaskPriceModal: (ev:React.SetStateAction<number>) => void,
    onChangeEditTaskTypeModal: (ev:React.SetStateAction<string>) => void,
    
    showShareListModal: boolean,
    shareListModalForm_username:string,
    shareListModalForm_currentlySharedWith:string[],
    toggleShowShareListModal: (ev:React.MouseEvent) => void,
    onSubmitShareListModal: (ev:React.FormEvent) => void,
    onChangeShareListModal: (ev:React.SetStateAction<string>) => void,

}

const ModalsComponent: React.FunctionComponent<ModalProps> = (props:ModalProps) => {

    return (<>
    <Modal show={props.showCreateListModal} onHide={props.toggleShowCreateListModal}>
        <Modal.Header closeButton>
            <Modal.Title>Create new list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={props.onSubmitCreateListModal}>
                <Form.Group controlId="newName">
                    <Form.Control 
                        onChange={(ev) => props.onChangeCreateListModal(ev.target.value)}
                        value={props.valueCreateListModal}
                        type="text" 
                        placeholder="Enter name for new to-do list" 
                        required/>
                    </Form.Group>
                <Button type="submit" block>Submit</Button>
            </Form>
        </Modal.Body>
    </Modal>
    
    <Modal show={props.showEditTaskModal} onHide={props.toggleShowEditTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={props.onSubmitEditTaskModal}>
                <Form.Group controlId="title">
                    <Form.Label>Task title</Form.Label>
                    <Form.Control
                        onChange={e=>props.onChangeEditTaskTitleModal(e.target.value)}
                        value={props.editTaskFormTitle}
                        type="text"
                        placeholder="Enter task title" 
                        required
                        name="taskTitle"/>
                </Form.Group>
                <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        onChange={e=>props.onChangeEditTaskPriceModal(+e.target.value)}
                        value={props.editTaskFormPrice}
                        type="number"
                        placeholder="Enter price"
                        step="0.01"
                        min="0"
                        name="taskPrice"/>
                </Form.Group>
                <Form.Group controlId="type">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                        onChange={e=>props.onChangeEditTaskTypeModal(e.target.value)}
                        value={props.editTaskFormType}
                        type="text"
                        placeholder="Enter price"
                        required
                        name="taskType"/>
                </Form.Group>
                <Button type="submit" block>Save</Button>
            </Form>
        </Modal.Body>
    </Modal>
    
    <Modal show={props.showDeleteTaskModal} onHide={props.toggleShowDeleteListModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete List?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={props.onSubmitDeleteListModal}>
                <Button type="submit" block>Yep</Button>
            </Form>
        </Modal.Body>
    </Modal>

    <Modal show={props.showShareListModal} onHide={props.toggleShowShareListModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share list with another user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={props.onSubmitShareListModal}>
            <Form.Group controlId="formUsername">
                <Form.Label>User to share with</Form.Label>
                <Form.Control 
                    type="text"
                    placeholder="Enter username"
                    onChange={e=>props.onChangeShareListModal(e.target.value)}
                    value={props.shareListModalForm_username}
                    required
                />
                <Form.Text className="text-muted">
                    Currently shared with: {props.shareListModalForm_currentlySharedWith.toString()}
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="shareButton">
                <Button type="submit" block>Share</Button>
            </Form.Group>
        </Form>
        </Modal.Body>
    </Modal>

    </>)
}

export default ModalsComponent;
