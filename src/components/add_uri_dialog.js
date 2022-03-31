/*
    AgentMPDFRB - modal dialog for adding a URI (song/track) to the playlist
    Copyright © 2022  Dave Hocker (email: AtHomeX10@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the LICENSE file for more details.

    You should have received a copy of the GNU General Public License
    along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Modal} from "react-bootstrap";
import {ajaxSend} from "./ajax_utils";

export class AddURIDialog extends React.Component {
    constructor(props) {
        super(props);

        this.focusElement = null;

        this.state = {
            show_dialog: props.show,
            uri: props.uri,
        };

        this.onAddURI = this.onAddURI.bind(this);
        this.onCancelAddURI = this.onCancelAddURI.bind(this);
        this.onURIChanged = this.onURIChanged.bind(this);
    }

    // Component is mounted
    componentDidMount() {
    }

    // Component will unmount
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Put focus in URI control
        if (this.focusElement !== null) {
            this.focusElement.focus();
        }

        if (prevProps.show !== this.props.show) {
            this.setState({
                show_dialog: this.props.show,
                uri: this.props.uri,
            });
        }
    }

    // Save the current playlist contents as a named playlist
    async onAddURI(evt) {
        console.log("Add uri: " + this.state.uri);
        await ajaxSend('/cpl/playlist', 'post', {"uris": [this.state.uri]});

        // Reload the playlist listbox to pick up the newly added track
        if (this.props.onAdd !== null) {
            this.props.onAdd(this.state.uri);
        }
    }

    onCancelAddURI(evt) {
        if (this.props.onCancel !== null) {
            this.props.onCancel();
        }
    }

    // Update the playlist name
    onURIChanged(evt) {
        const v = evt.target.value;
        console.log("URI: " + v);
        this.setState({uri: v});
    }

    render() {
        return (
            <Modal show={this.state.show_dialog} onHide={null}>
                <Modal.Header>
                    <Modal.Title>Add a song/track by URI</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Enter song/track URI
                    <Form>
                        <div className={"mb-3 form-group"}>
                            <Form.Control
                                className={"mb-3"}
                                onChange={this.onURIChanged}
                                value={this.state.uri}
                                ref={inputEl => (this.focusElement = inputEl)}
                            >
                            </Form.Control>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={"d-flex justify-content-center"}>
                    <Button
                        variant="primary"
                        onClick={this.onAddURI}
                        disabled={this.state.uri.length <= 0}
                    >
                        Add
                    </Button>
                    <Button variant="warning" onClick={this.onCancelAddURI}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

AddURIDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    uri: PropTypes.string.isRequired,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

AddURIDialog.defaultProps = {
    show: false,
};
