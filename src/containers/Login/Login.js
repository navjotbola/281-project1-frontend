import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import "./Login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isLoading: false
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
            window.location.reload();
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false })
        }
    }

    render() {
        return (
            <div className="Login">
                <div className="login-container shadow">
                    <h1><i class="fas fa-lock" style={{marginRight: "10px"}}></i>Locker</h1>
                    <p>A cloud storage app</p>
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </FormGroup>
                        <ButtonToolbar>
                            <Button className="btn btn-default pull-right" disabled={!this.validateForm()} type="submit">
                                Login
                            </Button>
                            <LinkContainer to={"/signup"}>
                                <Button bsStyle="success" className="btn btn-default pull-right">
                                    Sign Up
                                </Button>
                            </LinkContainer>
                        </ButtonToolbar>
                    </form>
                </div>
            </div>
        );
    }
}