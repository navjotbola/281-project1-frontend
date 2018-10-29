import React from "react";
import { Route, Switch } from "react-router-dom";
import Applied from "./components/RouteTypes/Applied";
import Authenticated from "./components/RouteTypes/Authenticated";
import AuthenticatedAdmin from "./components/RouteTypes/AuthenticatedAdmin";
import Unauthenticated from "./components/RouteTypes/Unauthenticated";
import Home from "./containers/Home/Home";
import Signup from "./containers/Signup/Signup";
import NewFile from "./containers/NewFile/NewFile";
import Files from "./containers/Files/Files";
import Admin from "./containers/Admin/Admin";
import NotFound from "./containers/Error/NotFound";

export default ({ childProps }) =>
    <Switch>
        <Applied path="/" exact component={Home} props={childProps}/>
        <Unauthenticated path="/signup" exact component={Signup} props={childProps} />
        <Authenticated path="/files/new" exact component={NewFile} props={childProps} />
        <Authenticated path="/files/:id" exact component={Files} props={childProps} />
        <AuthenticatedAdmin path="/admin" exact component={Admin} props={childProps} />
        <Route component={NotFound} />
    </Switch>;