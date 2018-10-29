import React, { Component } from "react";
import { API } from "aws-amplify";
import { Table, Button } from "react-bootstrap";
import { deletFileFromS3 } from "../../utils/s3Actions";
import "./Admin.css";

export default class NewFile extends Component {
    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            filesList: [],
            isLoading: true
        };
    }

    async componentDidMount() {
        if (!this.props.isLoggedIn || !this.props.isAdmin) {
            return;
        }
        this.getAllFiles()
    }

    async getAllFiles() {
        try {
            const filesList = await this.allFiles();
            this.setState({ filesList: filesList.Items });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
    }

    allFiles() {
        return API.get("files", "/admin");
    }

    handleDelete = async (fileId, userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this file?");
        if (!confirmed) {
            return;
        }
        try {
            await this.deleteFile(fileId, userId);
            window.location.reload();
        } catch (e) {
            alert(e);
        }
    }

    deleteFile(fileId, userId) {
        return API.del("files", `/admin/${fileId}`, {
            body: {
                userId
            }
        });
    }

    render() {
        const { filesList } = this.state;
        return (
            <div className="admin-page-container animated fadeIn">
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Description</th>
                            <th>Created at</th>
                            <th>Last edited at</th>
                            <th></th>
                        </tr>
                    </thead>
                    {filesList.map((file, index) => {
                        return(<tbody>
                            <tr>
                                <td>{index+1}</td>
                                <td>{file.firstname}</td>
                                <td>{file.lastname}</td>
                                <td>{file.description}</td>
                                <td>{new Date(file.createdAt).toLocaleString()}</td>
                                <td>{new Date(file.lastEdited).toLocaleString()}</td>
                                <td>
                                    <Button onClick={() => this.handleDelete(file.fileId, file.userId)} bsStyle="danger" className="pull-right delete">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        </tbody>)
                    })}
                </Table>
            </div>
        );
    }
}