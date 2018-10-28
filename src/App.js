import React, { Component, Fragment } from "react";
import { Auth } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      isLoggedIn: false,
      isLoggingIn: true,
    };
  }

  async componentDidMount() {
    this.validateUserSession();
  }

  // When this component loads, we want to check to see if the user
  // has or has not been authenticated. We then pass this information
  // to the rest of the application via the route component.
  async validateUserSession(){
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      const { attributes: { family_name, given_name } } = currentUser;    
      this.setState({ firstname: given_name, lastname: family_name });
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    this.setState({ isLoggingIn: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isLoggedIn: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/")
  }

  render() {
  
    // Child props we are sending out to the other components.
    const childProps = {
      isLoggedIn: this.state.isLoggedIn,
      userHasAuthenticated: this.userHasAuthenticated
    };

    const { firstname, lastname } = this.state;

    return (
      !this.state.isLoggingIn &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand >
              <Link to="/"><i class="fas fa-lock"></i>Locker</Link>
            </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.state.isLoggedIn ? <Navbar.Brand disabled>{firstname} {lastname}</Navbar.Brand> : null}
            {this.state.isLoggedIn ? <NavItem onClick={this.handleLogout}>
              <span style={{color: 'Tomato'}}>
                <i className="fas fa-sign-out-alt fa-fw"></i>
                Logout
              </span>
            </NavItem> : null
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes childProps={childProps} />
    </div>
    );
  }
}

export default withRouter(App);