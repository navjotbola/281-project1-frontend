import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Jumbotron, Form, Col, Button} from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import Dropzone from 'react-dropzone'
import { s3Upload, s3Delete } from "../../libs/awsLib";
import config from "../../config";
import "./Files.css";

export default class Files extends Component {
    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            isLoading: null,
            isDeleting: null,
            file: null,
            newFile: null,
            description: "",
            createdAt: "",
            lastEdited: "",
            attachmentURL: null
        };
    }

    async componentDidMount() {
        try {
            let attachmentURL;
            const file = await this.getFile();
            const { description, attachment, createdAt, lastEdited } = file;
            if (attachment) {
                attachmentURL = await Storage.vault.get(attachment);
            }
            this.setState({
                file,
                description,
                createdAt,
                lastEdited,
                attachmentURL
            });
        } catch (e) {
            alert(e);
        }
    }

    onDrop(files) {
        this.file = files[0];
        this.setState({newFile: files[0]});
    }

    getFile() {
        return API.get("files", `/files/${this.props.match.params.id}`);
    }

    validateForm() {
        return this.state.description.length > 0;
    }
    
    formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    handleChange = event => {
        this.setState({
        [event.target.id]: event.target.value
        });
    }

    saveFile(file) {
        return API.put("files", `/files/${this.props.match.params.id}`, {
            body: file
        });
    }

    handleSubmit = async event => {
        let attachment;
        event.preventDefault();
        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than
            ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
            return;
        }
        this.setState({ isLoading: true });
        try {
            if (this.file) {
                attachment = await s3Upload(this.file);
                // Delete the old file after uploading the new one
                await s3Delete(this.state.file);
            }
            await this.saveFile({
                description: this.state.description,
                attachment: attachment || this.state.file.attachment
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }
    
    deleteFile() {
        return API.del("files", `/files/${this.props.match.params.id}`);
    }

    handleDelete = async event => {
        event.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this file?");
        if (!confirmed) {
            return;
        }
        this.setState({ isDeleting: true });
        try {
            await this.deleteFile();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }
    
    render() {
        const { file, newFile } = this.state;
        return (
            <div>
                {file &&
                    <Jumbotron className="file-jumbotron animated fadeIn shadow">
                        <h4 className="file-header">File details</h4>
                        <form onSubmit={this.handleSubmit}>
                            <Form>
                                <FormGroup controlId="dates" className="form-group-edit">
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Date created
                                    </Col>
                                    <Col sm={4}>
                                        <FormControl
                                            type="text"
                                            value={new Date(file.createdAt).toLocaleString()} disabled/>
                                    </Col>
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Date last updated
                                    </Col>
                                    <Col sm={4}>
                                        <FormControl
                                            type="text"
                                            value={new Date(file.lastEdited).toLocaleString()} disabled/>
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="description" className="form-group-edit">
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Description
                                    </Col>
                                    <Col sm={10}>
                                        <FormControl
                                            type="text"
                                            placeholder="Description"
                                            onChange={this.handleChange}
                                            value={this.state.description}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="file" className="form-group-edit">
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Attachment (Click to download)
                                    </Col>
                                    <Col sm={10}>
                                        <a
                                            className="existing-attachment"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={this.state.attachmentURL}
                                        >
                                            {this.formatFilename(this.state.file.attachment)}
                                        </a>
                                    </Col>
                                    <Col sm={10}>
                                        <Dropzone
                                            className="dropzone"
                                            onDrop={this.onDrop.bind(this)}
                                            multiple={false}
                                        >
                                            <p>{newFile ? `File will be replaced by: ${newFile.name}` : 'Click or drag a file to replace'}</p>
                                        </Dropzone>
                                    </Col>
                                </FormGroup>
                                <Button type="submit" bsStyle="warning" className="pull-right action-button save">
                                    Save
                                </Button>
                                <Button onClick={this.handleDelete} bsStyle="danger" className="pull-right action-button delete">
                                    Delete
                                </Button>
                            </Form>
                        </form>
                    </Jumbotron>
                }
            </div>
        );
    }
}