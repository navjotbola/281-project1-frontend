import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Login.css";

function faceBookDidInitialize() {
    return new Promise((res, rej) => {
        const hasFbLoaded = () => {
            if (window.FB) {
                res();
            } else {
                setTimeout(hasFbLoaded, 300);
            }
        };
        hasFbLoaded();
    });
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isLoading: false
        };
    }

    async componentDidMount() {
        await faceBookDidInitialize();
    }

    statusChangeCallback = response => {
        if (response.status === "connected") {
            this.handleFaceBookResponse(response.authResponse);
        } else {
            this.handleFaceBookError(response);
        }
    };

    checkFaceBookLoginStatus = () => {
        window.FB.getLoginStatus(this.statusChangeCallback);
    };
    
    handleFaceBookError(error) {
        alert(error);
    }

    async handleFaceBookResponse(data) {
        const { email, accessToken: token, expiresIn } = data;
        console.log(data);
        const expires_at = expiresIn * 1000 + new Date().getTime();
        const user = { email };
        this.setState({ isLoading: true });
        try {
            const response = await Auth.federatedSignIn(
                "facebook",
                { token, expires_at },
                user
            );
            this.handleFbLogin(response);
        } catch (e) {
            this.handleFaceBookError(e);
        }
    }
    
    handleFbLogin = () => {
        this.props.userHasAuthenticated(true);
   };
    
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
            window.location.reload();
            this.props.userHasAuthenticated(true);
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false })
        }
    }

    loginWithFacebook = () => {
        window.FB.login(this.checkFaceBookLoginStatus, {scope: "public_profile, email"});
    };

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
                            <Button className="btn btn-default pull-right btn-success" disabled={!this.validateForm()} type="submit">
                                Login
                            </Button>
                            <LinkContainer to={"/signup"}>
                                <Button bsStyle="success" className="btn btn-default pull-right">
                                    Sign Up
                                </Button>
                            </LinkContainer>
                            <Button className="btn btn-default pull-right facebook-btn" onClick={this.loginWithFacebook}>
                                Login with FaceBook
                            </Button>
                        </ButtonToolbar>
                    </form>
                </div>
            </div>
        );
    }
}