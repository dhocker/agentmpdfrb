/*
    AgentMPDFRB - trigger an mpd database update
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
// import PropTypes from 'prop-types';
import {Container, Row, Col, Button, Alert, Spinner} from "react-bootstrap";
import { ajaxSend, ajaxGet } from "./components/ajax_utils";

export class UpdateDatabase extends React.Component {
    constructor(props) {
        super(props);

        this.statusTimerId = -1;
        this.statusTimerInterval = 2 * 1000; // milliseconds
        this.startTime = 0; // in milliseconds

        // Initial state with empty rows
        this.state = {
            show_alert: false,
            show_message: "",
        };

        this.onUpdateDatabase = this.onUpdateDatabase.bind(this);
        this.onIntervalTimerTick = this.onIntervalTimerTick.bind(this);
    }

    // Component is mounted
    componentDidMount() {
    }

    // Component will unmount
    componentWillUnmount() {
        // Remove status timer
        if (this.statusTimerId > 0) {
            clearInterval(this.statusTimerId);
            this.statusTimerId = -1;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    async onUpdateDatabase(evt) {
        // Trigger the database update. The return is a status object.
        const status = await ajaxSend("/player/musicdatabase", "PUT");
        console.log(status);

        this.startTime = Date.now();

        if ("updating_db" in status) {
            const msg = (<><p>Update database sequence {status.updating_db} started</p>
                <p>Elapsed time: {this.formatElapsedTime(0)}</p>
                <Spinner animation="border" />
                </>);
            this.setState({show_alert: true, show_message: msg});
        } else {
            this.setState({show_alert: true, show_message: "Update was triggered but no status was reported"});
        }

        // Start timer for status updates
        this.statusTimerId = setInterval(this.onIntervalTimerTick, this.statusTimerInterval);
    }

    async onIntervalTimerTick() {
        const status = await ajaxGet('/player/currentstatus');
        console.log(status);

        const elapsed = (Date.now() - this.startTime) / 1000;
        const fmtElapsed = this.formatElapsedTime(elapsed);

        if (!("updating_db" in status)) {
            clearInterval(this.statusTimerId);
            this.statusTimerId = -1;
            const msg = (<><p>Update complete</p>
                <p>Elapsed time: {fmtElapsed}</p>
                </>);
            this.setState({show_alert: true, show_message: msg});
        } else {
            const msg = (<><p>Update database sequence {status.updating_db} started</p>
                <p>Elapsed time: {fmtElapsed}</p>
                <Spinner animation="border" />
                </>);
            this.setState({show_alert: true, show_message: msg});
        }
    }

    // Format elapsed time in sec to hh:mm:ss
    formatElapsedTime(sec) {
        const date = new Date(0);
        date.setSeconds(sec);
        return date.toISOString().substring(11, 19);
    }

    render() {
        return (
            <Container className="mt-5 mb-5">
                <Row>
                    <Col>

                    </Col>
                    <Col className="text-center">
                        <h1>Update Database</h1>
                        <Button
                            variant="primary mt-3 mb-3"
                            onClick={this.onUpdateDatabase}
                            disabled={this.statusTimerId !== -1}
                        >
                            Update Database
                        </Button>
                        <Alert className="mt-3" variant="info" show={this.state.show_alert}>
                            <p>{this.state.show_message}</p>
                        </Alert>
                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Container>
        );
    }
}

UpdateDatabase.propTypes = {
};

UpdateDatabase.defaultProps = {
};
