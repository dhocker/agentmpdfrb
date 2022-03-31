/*
    AgentMPDFRB - page footer control
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
import { Link } from 'react-router-dom';
import {ajaxGet} from "./ajax_utils";

export class MainFooter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hostname: "unknown",
            release_version: "unknown",
            mpd_version: "unknown"
        };

        this.loadVersionData = this.loadVersionData.bind(this);
    }

    componentDidMount() {
        // Get MPD version data
        this.loadVersionData();
    }

    componentWillUnmount() {
    }

    async loadVersionData() {
        const $this = this;

        let version_data = await ajaxGet("/mpdversion");
        if (version_data !== null) {
            $this.setState(version_data);
        } else {
            const error = "loadVersionData failed"
            $this.showAlert("danger", error);
            console.error('AJAX error', error);
        }
    }

    render() {
        return (
            <footer className="container mt-3">
                <div className="row">
                    <div className="col-4">
                        MPD Protocol Version {this.state.mpd_version}
                    </div>
                    <div className="col-8 text-end">
                        <Link to="/about">
                            About AgentMPD-FRB
                        </Link>
                        &nbsp;
                        Version {this.state.release_version} on {this.state.hostname} © 2022 by Dave Hocker
                    </div>
                </div>
            </footer>
        );
    }
};
