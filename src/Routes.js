import React from "react";
import { Route, Switch } from "react-router-dom";
import Authenticated from "./components/RouteTypes/Authenticated";
import AuthenticatedAdmin from "./components/RouteTypes/AuthenticatedAdmin";
import Unauthenticated from "./components/RouteTypes/Unauthenticated";
import Home from "./containers/Home/Home";
import Signup from "./containers/Signup/Signup";
import Login from "./containers/Login/Login";
import NewFile from "./containers/NewFile/NewFile";
import Files from "./containers/Files/Files";
import Admin from "./containers/Admin/Admin";
import NotFound from "./containers/Error/NotFound";

export default ({ childProps }) =>
    <Switch>
        <Authenticated path="/" exact component={Home} props={childProps} />
        <Unauthenticated path="/login" exact component={Login} props={childProps} />
        <Unauthenticated path="/signup" exact component={Signup} props={childProps} />
        <Authenticated path="/files/new" exact component={NewFile} props={childProps} />
        <Authenticated path="/files/:id" exact component={Files} props={childProps} />
        <AuthenticatedAdmin path="/admin" exact component={Admin} props={childProps} />
        <Route component={NotFound} />
    </Switch>;