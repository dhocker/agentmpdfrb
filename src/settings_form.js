/*
    AgentMPDFRB - web app for controlling an mpd instance
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
import {Form} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {ajaxSend, ajaxGet} from "./components/ajax_utils";
import Alert from "react-bootstrap/Alert";

export class SettingsForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            host: "localhost",
            port: 6600,
            status_update_interval: 10,
            playlist_update_interval: 30,
            volume_increment: 5,
            alert_message: "",
            alert_variant: "primary"
        };

        this.timerId = -1;

        this.loadSettings = this.loadSettings.bind(this);
        this.onHostControlChange = this.onHostControlChange.bind(this);
        this.onNumericControlChange = this.onNumericControlChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.clearAlert = this.clearAlert.bind(this);
    }

    componentDidMount() {
        // Get current settings
        this.loadSettings();
    }

    componentWillUnmount() {
        // Kill timer
        this.clearAlert();
    }

    async loadSettings() {
        var $this = this;

        let settings = await ajaxGet("/settings");
        if (settings !== null) {
            $this.setState(settings);
        } else {
            const error = "loadSettings failed"
            $this.showAlert("danger", error);
            console.error('AJAX error', error);
        }
    }

    onHostControlChange(ev) {
        if (ev.target.value.length === 0) {
            this.showAlert("danger", `${ev.target.name} value is invalid`);
        } else {
            this.setState({[ev.target.name]: ev.target.value});
            this.clearAlert();
        }
    }

    onNumericControlChange(ev) {
        if (isNaN(ev.target.value) || ev.target.value === "") {
            this.showAlert("danger", `${ev.target.name} value is invalid`);
            this.setState({[ev.target.name]: ev.target.value});
        } else {
            this.setState({[ev.target.name]: parseInt(ev.target.value)});
            this.clearAlert();
        }
    }

    async onSave() {
        // Validate values (host name or IP address)
        // TODO Validate other values
        if (this.isHostValid(this.state.host)) {
            // We send the entire state. The server ignores extra properties.
            let resp = await ajaxSend("/settings", "PUT", this.state);
            // console.log(resp);
            if (resp.ok) {
                this.showAlert("primary", "Saved");
            } else {
                this.showAlert("danger", resp.statusText);
            }
        } else {
            this.showAlert("danger", "Invalid host name or host IP address");
            document.settings.host.focus();
        }
    }

    isHostValid(host) {
        if (host.length > 0 && isNaN(host.substring(0, 1))) {
            // Not an IP address
            return true;
        }
        // An IP address
        if (this.isIPAddress(host)) {
            return true;
        }
        return false;
    }

    showAlert(variant, message) {
        this.clearAlert();
        this.setState({alert_variant: variant, alert_message: message});
        this.timerId = setInterval(this.clearAlert, this.state.status_update_interval * 1000);
    }

    clearAlert() {
        this.setState({alert_variant: "primary", alert_message: ""});
        if (this.timerId >= 0) {
            clearInterval(this.timerId);
            this.timerId = -1;
        }
    }

    isIPAddress(ipAddress) {
        // Ref: https://www.w3resource.com/javascript/form/ip-address-validation.php
        const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (ipAddress.match(ipformat)) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div>
                <div className="jumbotron text-center h-25 p-1 my-2">
                    <h1 className="text-primary">React-Bootstrap Form</h1>
                </div>

                {/* 50% width */}
                <Form name="settings" className="w-50">
                    <div>
                        {this.state.alert_message.length > 0 &&
                        <Alert variant={this.state.alert_variant}>
                            {this.state.alert_message}
                        </Alert>
                        }
                    </div>
                    <Form.Group controlId="host">
                        <Form.Label>Host name or IP address</Form.Label>
                        <Form.Control name="host"
                                      type="text"
                                      placeholder="Enter hostname or IP address"
                                      defaultValue={this.state.host}
                                      value={this.state.host}
                                      onChange={this.onHostControlChange}
                        />
                        <Form.Text className="text-muted">
                            This is the MPD service you want to use
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="port">
                        <Form.Label>Host port number</Form.Label>
                        <Form.Control name="port"
                                      type="text"
                                      placeholder="Enter port"
                                      defaultValue={this.state.port}
                                      value={this.state.port}
                                      onChange={this.onNumericControlChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="status_update_interval">
                        <Form.Label>Status update interval</Form.Label>
                        <Form.Control name="status_update_interval"
                                      type="text"
                                      placeholder="Enter status update interval (seconds)"
                                      defaultValue={this.state.status_update_interval}
                                      value={this.state.status_update_interval}
                                      onChange={this.onNumericControlChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="playlist_update_interval">
                        <Form.Label>Playlist update interval</Form.Label>
                        <Form.Control name="playlist_update_interval"
                                      type="text"
                                      placeholder="Enter playlist update interval (seconds)"
                                      defaultValue={this.state.playlist_update_interval}
                                      value={this.state.playlist_update_interval}
                                      onChange={this.onNumericControlChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="volume_increment">
                        <Form.Label>Volume increment</Form.Label>
                        <Form.Control name="volume_increment"
                                      type="text"
                                      placeholder="Enter volume increment"
                                      defaultValue={this.state.volume_increment}
                                      value={this.state.volume_increment}
                                      onChange={this.onNumericControlChange}
                        />
                    </Form.Group>
                    <Button variant="primary mt-3" onClick={this.onSave}>
                        Save
                    </Button>
                </Form>
            </div>
        );
    }
}
