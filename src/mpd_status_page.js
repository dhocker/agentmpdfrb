/*
    AgentMPDFRB - mpd status page
    Copyright © 2022 Dave Hocker (email: AtHomeX10@gmail.com)

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
import {Table, Col, Container, Row} from "react-bootstrap";
import {ajaxGet} from "./components/ajax_utils";
import {MPDStatus} from "./components/mpd_status";

// import PropTypes from 'prop-types';

export class MPDStatusPage extends React.Component {
    constructor(props) {
        super(props);

        // Initial state with empty rows
        this.state = {
        };
    }

    // Component is mounted
    componentDidMount() {
    }

    // Component will unmount
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        return (
            <Container className="mt-5 mb-5">
                <Row>
                    <Col md={2}>
                    </Col>
                    <Col className="text-center" md={8}>
                        <h1>MPD Status</h1>
                    </Col>
                    <Col md={2}>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                    </Col>
                    <Col md={8}>
                        <MPDStatus />
                    </Col>
                    <Col md={2}>
                    </Col>
                </Row>
            </Container>
        );
    }
}

MPDStatusPage.propTypes = {
};

MPDStatusPage.defaultProps = {
};
