/*
    AgentMPDFRB - modal dialog for asking an OK/Cancel question
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

export class OKCancelDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show_dialog: props.show,
            title: "",
            message: "",
        };

        this.onOKClose = this.onOKClose.bind(this);
        this.onCancelClose = this.onCancelClose.bind(this);
    }

    // Component is mounted
    componentDidMount() {
    }

    // Component will unmount
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.show !== this.props.show) {
            this.setState({show_dialog: this.props.show});
        }
    }

    onOKClose(evt) {
        if (this.props.onOK !== null) {
            this.props.onOK();
        }
    }

    onCancelClose(evt) {
        if (this.props.onCancel !== null) {
            this.props.onCancel();
        }
    }

    render() {
        return (
            <Modal show={this.state.show_dialog} onHide={null}>
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.message}
                </Modal.Body>
                <Modal.Footer className={"d-flex justify-content-center"}>
                    <Button
                        variant="primary"
                        onClick={this.onOKClose}
                    >
                        OK
                    </Button>
                    <Button
                        variant="primary"
                        onClick={this.onCancelClose}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

OKCancelDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    onOK: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

OKCancelDialog.defaultProps = {
    show: false,
    message: "",
    title: "",
    onOK: null,
    onCancel: null,
};
