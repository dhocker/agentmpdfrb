/*
    AgentMPDFRB - mpd status component
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
import PropTypes from 'prop-types';
import {Table, Col, Container, Row} from "react-bootstrap";
import {ajaxGet} from "./ajax_utils";

export class MPDStatus extends React.Component {
    constructor(props) {
        super(props);

        this.statusTimerId = -1;

        // Initial state with empty rows
        this.state = {
            data: {},
        };

        this.loadCurrentStatus = this.loadCurrentStatus.bind(this);
    }

    // Component is mounted
    async componentDidMount() {
        await this.loadCurrentStatus();
        this.statusTimerId = setInterval(this.loadCurrentStatus, this.props.updateinterval);
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

    async loadCurrentStatus() {
        const $this = this;

        const data = await ajaxGet('/player/currentstatus');

        if (data !== null) {
            $this.setState({data: data});
         } else {
            const error = "loadCurrentStatus failed"
            console.error('AJAX error', error);
        }
    }

    render() {
        const rows = this.generateKeyValueRows(this.state.data);

        return (
            <>
                <Table striped bordered>
                    <thead>
                        <th>Key</th>
                        <th>Value</th>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                    <tfoot>
                        <p>Update interval: {this.props.updateinterval / 1000} (sec)</p>
                    </tfoot>
                </Table>
            </>
        );
    }

    // Generate a table row for each key/value pair in the status data
    generateKeyValueRows(data) {
        const keys = Object.keys(data);

        return keys.map(
            function(key) {
                return (
                    <tr key={key} id={key}>
                        <td>
                            {key}
                        </td>
                        <td>
                            {data[key]}
                        </td>
                    </tr>
                );
            }
        );
    }
}

MPDStatus.propTypes = {
    updateinterval: PropTypes.number,
};

MPDStatus.defaultProps = {
    updateinterval: 10 * 1000,
};
