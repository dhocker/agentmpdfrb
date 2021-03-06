/*
    AgentMPDFRB - horizontal volume control component
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
import './volume_slider.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

export class VolumeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: props.initialVolume
        };

        this.onVolumeSliderChange = this.onVolumeSliderChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.initialVolume !== this.props.initialVolume) {
            this.setState({volume: this.props.initialVolume});
        }
    }

    onVolumeSliderChange(event) {
        const newVolume = event.target.valueAsNumber;
        this.setState({volume: newVolume});
        ajaxSend(`/player/volumelevel/${newVolume}`, "PUT");
    }

    render() {
        return (
            <div className="container mx-0 my-1 px-0">
                <div className="row mx-0 px-0">
                    <div className="col-sm-auto mx-0 px-0">
                        <img src="static/volume.png" className="volume-slider-icon" alt="volume"></img>
                    </div>
                    <div className="col mx-0 pr-0">
                        <RangeSlider
                            size="sm"
                            min={0}
                            max={100}
                            value={this.state.volume}
                            onChange={this.onVolumeSliderChange}
                            tooltip="off"
                        />
                    </div>
                    <div className="col-sm-auto mx-0 pr-0">
                        <span>{this.state.volume}</span>
                    </div>
                </div>
            </div>
        );
    }
}

VolumeSlider.propTypes = {
    initialVolume: PropTypes.number.isRequired
};

VolumeSlider.defaultProps = {
};
