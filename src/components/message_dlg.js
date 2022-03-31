/*
    AgentMPDFRB - modal dialog for displaying a message
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
import {Button, Modal} from "react-bootstrap";

export class MessageDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show_message_dialog: props.show,
            title: "",
            message: "",
        };

        this.onCloseMessage = this.onCloseMessage.bind(this);
    }

    // Component is mounted
    componentDidMount() {
    }

    // Component will unmount
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.show !== this.props.show) {
            this.setState({show_message_dialog: this.props.show});
        }
    }

    onCloseMessage(evt) {
        if (this.props.onOK !== null) {
            this.props.onOK();
        }
    }

    render() {
        return (
            <Modal show={this.state.show_message_dialog} onHide={null}>
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.message}
                </Modal.Body>
                <Modal.Footer className={"d-flex justify-content-center"}>
                    <Button
                        variant="primary"
                        onClick={this.onCloseMessage}
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

MessageDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    onOK: PropTypes.func.isRequired,
};

MessageDialog.defaultProps = {
    show: false,
    message: "",
    title: "",
    onOK: null,
};
