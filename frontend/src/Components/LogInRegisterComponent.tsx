import React, { FormEvent, useState } from 'react';
import {logInService, registerService} from '../Services/main.service';

import Tabs from 'react-bootstrap/esm/Tabs';
import Tab from 'react-bootstrap/esm/Tab';
import Card from 'react-bootstrap/esm/Card';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/esm/Alert';

interface LogInRegisterProps {
    onLogIn: () => void,
};

const LogInRegisterComponent: React.FunctionComponent<LogInRegisterProps> = (props:LogInRegisterProps) => {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRepeatPassword, setRegisterRepeatPassword] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');

    function onLogin(ev: FormEvent): void {
        ev.preventDefault();

        logInService({
            login: loginUsername,
            password: loginPassword,
            lists: []
        }, () => {
            setLoginMessage("");
            props.onLogIn();
        }, (errorMessage) => {
            setLoginMessage(errorMessage || "Something went wrong");
        });
    }

    function onRegister(ev: FormEvent): void {
        ev.preventDefault();

        if (registerPassword !== registerRepeatPassword) {
            setRegisterMessage("Passwords do not match");
            return
        }

        registerService({
            login: registerUsername,
            password: registerPassword,
            lists: []
        }, () => {
            setRegisterMessage("");
            props.onLogIn();
        }, (errorMessage) => {
            setRegisterMessage(errorMessage || "Something went wrong");
        });
    }

    return (<>
        <Tabs 
            variant='pills'
            justify
            id="tabs"
            style={{ margin: '1rem' }}>
                <Tab key="logIn" eventKey="logIn" title="Log In">
                <Card style={{ margin: '1rem', height: '75vh', overflowY: 'auto'}} >
                    <Card.Body>
                        <Form onSubmit={ (ev) => onLogin(ev)}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                    type="text"
                                    placeholder="Enter username"
                                    onChange={e=>setLoginUsername(e.target.value)}
                                    value={loginUsername}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password"
                                    placeholder="Password" 
                                    onChange={e=>setLoginPassword(e.target.value)}
                                    value={loginPassword}
                                    required
                                    />
                            </Form.Group>
                            <Form.Group controlId="submitButton">
                                <Button variant="outline-primary" type="submit" block size="sm">Login</Button>
                            </Form.Group>
                            <Form.Group controlId="responseMessage">
                            { loginMessage.length ? <Alert variant="danger">{loginMessage}</Alert> : '' }
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                </Tab>
                <Tab key="register" eventKey="register" title="Register">
                <Card style={{ margin: '1rem', height: '75vh', overflowY: 'auto'}} >
                    <Card.Body>
                        <Form onSubmit={(ev) => onRegister(ev)}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                    type="text"
                                    placeholder="Enter username"
                                    onChange={e=>setRegisterUsername(e.target.value)}
                                    value={registerUsername}
                                    required
                                    />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password"
                                    placeholder="Password"
                                    onChange={e=>setRegisterPassword(e.target.value)}
                                    value={registerPassword}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPasswordRepeat">
                                <Form.Label>Repeat password</Form.Label>
                                <Form.Control 
                                    type="password"
                                    placeholder="Repeat password"
                                    onChange={e=>setRegisterRepeatPassword(e.target.value)}
                                    value={registerRepeatPassword}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="registerButton">
                                <Button variant="outline-primary" type="submit" block size="sm">Register</Button>
                            </Form.Group>

                            <Form.Group controlId="registerMessage">
                                { registerMessage.length ? <Alert variant="danger">{registerMessage}</Alert> : '' }
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
                </Tab>
        </Tabs>
    </>
    )
}

export default LogInRegisterComponent;