import { faShareSquare, faSnowflake, faEye, faTrashAlt, faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';

import Card from 'react-bootstrap/esm/Card';

export interface FooterProps {
    showCompletedTasks: boolean,
    isListFrozen: boolean,

    onClickShowModalShareList: (ev:React.MouseEvent) => void,
    onClickToggleIsListFrozen: (ev:React.MouseEvent) => void,
    onClickToggleshowCompletedTasks: (ev:React.MouseEvent) => void,
    onClickShowModalDeleteList: (ev:React.MouseEvent) => void,
    onClickShowModalCreateList: (ev:React.MouseEvent) => void,
}

const FooterComponent: React.FunctionComponent<FooterProps> = (props:FooterProps) => {

    return (
        <div className="fixed-bottom"
        style={{backgroundColor: 'white'}}>
   <Card style={{ margin: '1rem', height: '5vh', minHeight: '50px', border: '0px'}}>
     <Card.Body style={{padding: '0px'}}>
       <p style={{marginBottom: '8px'}}><strong><sub>List control</sub></strong></p>
     </Card.Body>
     <Card.Body style={{padding: '0px'}}>
       <Container fluid={true}>
         <Row>
             <Col style={{padding: '0px 5px'}}>
               <Button variant="outline-primary"
                       size="sm"
                       block
                       onClick={props.onClickShowModalShareList}>
                 {<FontAwesomeIcon icon={faShareSquare} />} 
               </Button>
             </Col>
             <Col style={{padding: '0px 5px'}}>
               <Button variant={props.isListFrozen ? "primary" : "outline-primary" }
                       size="sm"
                       block
                       onClick={props.onClickToggleIsListFrozen}>
                 {<FontAwesomeIcon icon={faSnowflake} />} 
               </Button>
             </Col>
             <Col style={{padding: '0px 5px'}}>
               <Button variant={props.showCompletedTasks ? "primary" : "outline-primary" }
                       size="sm"
                       block
                       onClick={props.onClickToggleshowCompletedTasks}>
                 {<FontAwesomeIcon icon={faEye} />}
               </Button>
             </Col>
             <Col style={{padding: '0px 5px'}}>
               <Button 
                variant="outline-primary"
                size="sm"
                block
                onClick={props.onClickShowModalDeleteList}>
                 {<FontAwesomeIcon icon={faTrashAlt} />}
               </Button>
             </Col>
             <Col style={{padding: '0px 5px'}}>
               <Button 
                   variant="outline-primary"
                   size="sm"
                   block
                   onClick={props.onClickShowModalCreateList}>
                 {<FontAwesomeIcon icon={faPlusSquare} />}
               </Button>
             </Col>
         </Row>
       </Container>
     </Card.Body>
   </Card>
   </div>
    )
}

export default FooterComponent;
