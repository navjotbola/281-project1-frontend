import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home/Home";
import Signup from "./containers/Signup/Signup";
import NewFile from "./containers/NewFile/NewFile";
import Files from "./containers/Files/Files";
import NotFound from "./containers/Error/NotFound";

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps}/>
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <AuthenticatedRoute path="/files/new" exact component={NewFile} props={childProps} />
        <AuthenticatedRoute path="/files/:id" exact component={Files} props={childProps} />
        <Route component={NotFound} />
    </Switch>;