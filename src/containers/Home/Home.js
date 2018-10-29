import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import { Button, Alert, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Login from "../Login/Login";
import "./Home.css";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            files: [],
            isLoggedIn: false,
            firstname: null,
            lastname: null
        };
    }

    async componentDidMount() {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return;
        }
        this.getFiles()
        this.setState({isLoggedIn});
    }

    async getFiles() {
        try {
            const files = await this.files();
            this.setState({ files });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }

    files() {
        return API.get("files", "/files");
    }

    renderFilesList(files) {
        if (!files.length) {
            return (
                <Alert className="alert-white">
                    <strong>Its a bit empty here!</strong>
                    <p>Start filling up your locker by hitting the "Add a new file" button above.</p>
                </Alert>
            )
        }
        return files.map((file, i) =>
            <div className="inline">
                <LinkContainer key={file.filesId} to={`/files/${file.fileId}`}>
                    <div className="file-container animated fadeIn shadow">
                        <i className="far fa-file file-icon"></i>
                        <span className="file-description">{file.description}</span>
                        <span><i className="far fa-clock fa-fw"></i>{new Date(file.createdAt).toLocaleString()}</span>
                        <span><i className="far fa-edit fa-fw"></i>{new Date(file.lastEdited).toLocaleString()}</span>
                    </div>
                </LinkContainer>
            </div>
        );
    }
    
    handleFileClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderLander = () => {
        const authenticationProps = this.props;
        return <Login userHasAuthenticated={this.props.userHasAuthenticated}/>;
    }

    renderFiles() {
        return (
            <div className="home-page">
                {!this.state.isLoading && this.renderFilesList(this.state.files)}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.isLoggedIn ?
                <Row>
                    <LinkContainer key="new" to="/files/new">
                        <Button className="add-files-btn"><i className="fas fa-plus"></i>Add a new file</Button>
                    </LinkContainer>
                </Row>
                 : null}
                {this.props.isLoggedIn ? this.renderFiles() : this.renderLander()}
            </div>
        );
    }
}