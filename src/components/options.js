/*
    AgentMPDFRB - MPD options display component
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

export class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.onChanged = this.onChanged.bind(this);
    }

    // Playback option changed
    onChanged(event) {
        // Propagate the event
        if (this.props.onChanged !== null) {
            this.props.onChanged(event.target.name, event.target.checked);
        }
    }

    render() {
        return (
            <div className="card mx-2">
                <div className="card-header text-center">
                    Options
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <label className="form-check-label" htmlFor="random">
                                <input type="checkbox" className="form-check-input" id="random" name="random" checked={!!this.props.random} onChange={this.onChanged}/>Random
                                </label>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input" name="repeat" checked={!!this.props.repeat} onChange={this.onChanged}/>Repeat
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input" name="consume" checked={!!this.props.consume} onChange={this.onChanged}/>Consume
                                </label>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input" name="single" checked={!!this.props.single} onChange={this.onChanged}/>Single
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Options.propTypes = {
    random: PropTypes.bool,
    repeat: PropTypes.bool,
    consume: PropTypes.bool,
    single: PropTypes.bool,
    onChanged: PropTypes.func
};

Options.defaultProps = {
    random: false,
    repeat: false,
    consume: false,
    single: false,
    onChanged: null
};
