/*
    AgentMPDFRB - modal dialog for saving a playlist
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

export class SavePlaylistDialog extends React.Component {
    constructor(props) {
        super(props);

        this.focusElement = null;

        this.state = {
            show_dialog: props.show,
            playlist_name: props.playlist_name,
        };

        this.onSaveNamedPlaylist = this.onSaveNamedPlaylist.bind(this);
        this.onCancelSaveNamedPlaylist = this.onCancelSaveNamedPlaylist.bind(this);
        this.onPlaylistNameChanged = this.onPlaylistNameChanged.bind(this);
    }

    // Component is mounted
    componentDidMount() {
    }

    // Component will unmount
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Put focus in playlist name control
        if (this.focusElement !== null) {
            this.focusElement.focus();
        }

        if (prevProps.show !== this.props.show) {
            this.setState({
                show_dialog: this.props.show,
                playlist_name: this.props.playlist_name,
            });
        }
    }

    // Save the current playlist contents as a named playlist
    async onSaveNamedPlaylist(evt) {
        console.log("Save named playlist: " + this.state.playlist_name);

        // Save the playlist by name
        const arg_list = {"name": this.state.playlist_name};
        await ajaxSend("/cpl/namedplaylists","post", arg_list);

        // Reload the playlist listbox to pick up the newly save playlist
        if (this.props.onSave !== null) {
            this.props.onSave(this.state.playlist_name);
        }
    }

    onCancelSaveNamedPlaylist(evt) {
        if (this.props.onCancel !== null) {
            this.props.onCancel();
        }
    }

    // Update the playlist name
    onPlaylistNameChanged(evt) {
        const v = evt.target.value;
        console.log("Playlist name: " + v);
        this.setState({playlist_name: v});
    }

    render() {
        return (
            <Modal show={this.state.show_dialog} onHide={null}>
                <Modal.Header>
                    <Modal.Title>Save playlist by name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Enter playlist name
                    <Form>
                        <div className={"mb-3 form-group"}>
                            <Form.Control
                                className={"mb-3"}
                                onChange={this.onPlaylistNameChanged}
                                value={this.state.playlist_name}
                                ref={inputEl => (this.focusElement = inputEl)}
                            >
                            </Form.Control>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={"d-flex justify-content-center"}>
                    <Button
                        variant="primary"
                        onClick={this.onSaveNamedPlaylist}
                        disabled={this.state.playlist_name.length <= 0}
                    >
                        Save
                    </Button>
                    <Button variant="warning" onClick={this.onCancelSaveNamedPlaylist}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

SavePlaylistDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    playlist_name: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

SavePlaylistDialog.defaultProps = {
    show: false,
};
