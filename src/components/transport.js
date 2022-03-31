/*
    AgentMPDFRB - playback transport display component
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
import {STATE_STOPPED, STATE_PAUSED, STATE_UNKNOWN} from "./mpd_utils";

export class Transport extends React.Component {
    constructor(props) {
        super(props);

        // size can be sm, md, lg, xl or a number
        // The values used here are px and there is nothing magic about the chosen values
        var imgWH = 32;
        switch (props.size.toLowerCase()) {
            case "md":
                imgWH = 48;
                break;
            case "lg":
                imgWH = 72;
                break;
            case "sm":
                imgWH = 32;
                break;
            case "xl":
                imgWH = 108;
                break;
            default:
                imgWH = parseInt(props.size, 10);
                imgWH = isNaN(imgWH) ? 32 : imgWH;
                break;
        }

        this.state = {
            img_wh: imgWH
        };

        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onStop = this.onStop.bind(this);
        this.playOrPauseButton = this.playOrPauseButton.bind(this);
        this.onTrackFirst = this.onTrackFirst.bind(this);
        this.onTrackNext = this.onTrackNext.bind(this);
        this.onTrackPrevious = this.onTrackPrevious.bind(this);
        this.onTrackLast = this.onTrackLast.bind(this);
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
    }

    // Previous transport button clicked
    async onTrackPrevious(event) {
        this.props.onPrevious();
    }

    // First transport button clicked
    async onTrackFirst(event) {
        this.props.onFirst();
    }

    // Next transport button clicked
    async onTrackNext(event) {
        this.props.onNext();
    }

    // Last transport button clicked
    async onTrackLast(event) {
        this.props.onLast();
    }

    async onPlay(event) {
        this.props.onPlay();
    }

    async onPause(event) {
        this.props.onPause();
    }

    async onStop(event) {
        this.props.onStop();
    }

    playOrPauseButton() {
        switch(this.props.currentState) {
            case STATE_STOPPED:
            case STATE_PAUSED:
                return (
                    <button className="btn btn-primary btn-sm">
                        <img src="static/playback-start.png"
                            width={this.state.img_wh}
                            height={this.state.img_wh}
                            className=""
                            alt="start"
                            title="Start"
                            onClick={this.onPlay}
                        />
                    </button>
                );
            default:
                return (
                    <button className="btn btn-primary btn-sm">
                        <img src="static/playback-pause.png"
                            width={this.state.img_wh}
                            height={this.state.img_wh}
                            className=""
                            alt="start"
                            title="Pause"
                            onClick={this.onPause}
                        />
                    </button>
                )
        }
    }

    render() {
        return (
            <div className="btn-group" role="group">
                <button className="btn btn-primary btn-sm">
                    <img src="static/playback-first.png"
                        width={this.state.img_wh}
                        height={this.state.img_wh}
                        className=""
                        alt="first"
                        title="First"
                        onClick={this.onTrackFirst}
                    />
                </button>
                <button className="btn btn-primary btn-sm">
                    <img src="static/playback-previous.png"
                        width={this.state.img_wh}
                        height={this.state.img_wh}
                        className=""
                        alt="previous"
                        title="Previous"
                        onClick={this.onTrackPrevious}
                    />
                </button>
                {this.playOrPauseButton()}
                <button className="btn btn-primary btn-sm">
                    <img src="static/playback-stop.png"
                        width={this.state.img_wh}
                        height={this.state.img_wh}
                        className=""
                        alt="stop"
                        title="Stop"
                        onClick={this.onStop}/>
                </button>
                <button className="btn btn-primary btn-sm">
                    <img src="static/playback-next.png"
                        width={this.state.img_wh}
                        height={this.state.img_wh}
                        className=""
                        alt="next"
                        title="Next"
                        onClick={this.onTrackNext}
                    />
                </button>
                <button className="btn btn-primary btn-sm">
                    <img src="static/playback-last.png"
                        width={this.state.img_wh}
                        height={this.state.img_wh}
                        className=""
                        alt="last"
                        title="Last"
                        onClick={this.onTrackLast}
                    />
                </button>
            </div>
        );
    }
}

Transport.propTypes = {
    currentState: PropTypes.number,
    onFirst: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onLast: PropTypes.func.isRequired,
    size: PropTypes.string
};

Transport.defaultProps = {
    initialState: STATE_UNKNOWN,
    size: "sm"
};
