/*
    AgentMPDFRB - track position slider component
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
import { ajaxSend } from "./ajax_utils";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

export class TrackSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: parseInt(props.position, 10),
            duration: parseInt(props.duration, 10)
        };

        this.onSliderChange = this.onSliderChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.position !== this.props.position) {
            this.setState({position: this.props.position});
        }
        if (prevProps.duration !== this.props.duration) {
            this.setState({duration: this.props.duration});
        }
    }

    formatTimeSeconds(t) {
        var tt = parseInt(String(t).replace(":", "."));

        var hh_part = "";
        var hh = parseInt(tt / 3600);
        if (hh > 0) {
            hh_part = String(hh) + ":";
        }

        var mm = parseInt((tt - (hh * 3600)) / 60);
        var mm_part = String(mm) + ":";
        if (hh_part.length > 0 && mm < 10) {
            mm_part = "0" + mm_part;
        }

        var ss = parseInt(tt % 60);
        var ss_part = String(ss);
        if (ss < 10) {
            ss_part = "0" + ss_part;
        }

        return hh_part + mm_part + ss_part;
    };

    onSliderChange(event) {
        if (this.props.onChange !== null) {
            this.props.onChange(event);
        } else {
            this.setState({position: parseInt(event.target.value)});
        }
        // TODO Send track position to server
        ajaxSend(`/player/songposition/${event.target.value}`, "PUT")
    }

    render() {
        return (
            <div className="container mx-0 my-1 px-0 py-1">
                <div className="row mx-0 px-0">
                    <div className="col-sm-auto mx-0 px-0">
                        <span>{this.formatTimeSeconds(this.state.position)}</span>
                    </div>
                    <div className="col mx-0 pr-0">
                        <RangeSlider
                            size="sm"
                            min={0}
                            max={parseInt(this.state.duration, 10)}
                            value={this.state.position}
                            onChange={this.onSliderChange}
                            tooltip="off"
                        />
                    </div>
                    <div className="col-sm-auto mx-0 pr-0">
                        <span>{this.formatTimeSeconds(this.state.duration)}</span>
                    </div>
                </div>
            </div>
        );
    }
}

TrackSlider.propTypes = {
    duration: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    onChange: PropTypes.func
};

TrackSlider.defaultProps = {
    onChange: null
};
