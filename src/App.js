import React, { Component, Fragment } from "react";
import { Auth } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import config from "./config";
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
      isAdmin: false,
    };
  }

  async componentDidMount() {
    this.initializeFBSDK();
    this.validateUserSession();
  }

  initializeFBSDK() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : config.social.facebook,
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
        
      window.FB.AppEvents.logPageView();   
        
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));  
  }

  // When this component loads, we want to check to see if the user
  // has or has not been authenticated. We then pass this information
  // to the rest of the application via the route component.
  // Also check if the use is an admin
  async validateUserSession(){
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      const { attributes: { family_name, given_name } } = currentUser;    
      this.userIsAdmin(currentUser);
      this.setState({ firstname: given_name, lastname: family_name });
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    this.setState({ isLoggingIn: false });
  }

  userIsAdmin = currentUser => {
    if(currentUser.attributes.profile && currentUser.attributes.profile === "admin") {
      this.setState({ isAdmin: true });
    }
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isLoggedIn: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/")
  }

  goToAdminPage = async event => {
    this.props.history.push("/admin")
  }

  render() {
    const { isLoggedIn, isAdmin } = this.state;
    // Child props we are sending out to the other components.
    const childProps = {
      isLoggedIn,
      isAdmin,
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
            {isLoggedIn && isAdmin ? <Navbar.Brand style={{cursor: "pointer"}} onClick={this.goToAdminPage} disabled>Admin</Navbar.Brand> : null}
            {isLoggedIn && !isAdmin ? <Navbar.Brand disabled>{firstname} {lastname}</Navbar.Brand> : null}
            {isLoggedIn ? <NavItem onClick={this.handleLogout}>
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