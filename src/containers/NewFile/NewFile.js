import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Jumbotron, Form, Col, Button} from "react-bootstrap";
import Dropzone from 'react-dropzone'
import configurations from "../../utils/configurations";
import { API } from "aws-amplify";
import { uploadFileToS3 } from "../../utils/s3Actions";
import "./NewFile.css";

export default class NewFile extends Component {
    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            isLoading: null,
            description: "",
            newFile: ""
        };
    }

    validateForm() {
        return this.state.description.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    onDrop(files) {
        this.file = files[0];
        this.setState({newFile: files[0]});
    }

    handleSubmit = async event => {
        event.preventDefault();
        if (!this.state.description) {
            alert("You must add a description");
            return;
        }
        if (!this.file) {
            alert("You must specify a file to upload");
            return;
        }
        if (this.file && this.file.size > configurations.FILE_SIZE) {
            alert(`Please pick a file smaller than
            ${configurations.FILE_SIZE/1000000} MB.`);
            return;
        }
        this.setState({ isLoading: true });
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            let firstname = null;
            let lastname = null
            if(currentUser.attributes) {
                const { attributes: { family_name, given_name } } = currentUser;
                firstname = given_name;
                lastname = family_name;
            }
            const attachment = this.file ? await uploadFileToS3(this.file): null;
            await this.createFile({
                attachment,
                description: this.state.description,
                firstname,
                lastname
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    createFile(file) {
        return API.post("files", "/files", {
            body: file
        });
    }

    render() {
        const { newFile } = this.state;
        return (
        <div>
            <Jumbotron className="new-file-jumbotron animated fadeIn shadow">
                <h4 className="file-header">
                    Upload a new file
                </h4>
                <form onSubmit={this.handleSubmit}>
                    <Form>
                        <FormGroup controlId="description" className="form-group-new">
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
                        <FormGroup controlId="file">
                            <Col componentClass={ControlLabel} sm={2}>
                                Attachment
                            </Col>
                            <Col sm={10}>
                                <Dropzone
                                    className="dropzone"
                                    onDrop={this.onDrop.bind(this)}
                                    multiple={false}
                                >
                                    <p>{newFile ? `File to upload: ${newFile.name}` : 'Click or drag a file to replace'}</p>
                                </Dropzone>
                            </Col>
                        </FormGroup>
                        <Button type="submit" bsStyle="warning" className="pull-right action-button save">
                            Upload
                        </Button>
                    </Form>
                </form>
            </Jumbotron>
        </div>
        );
    }
}