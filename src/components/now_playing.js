/*
    AgentMPDFRB - "Now Playing" display component
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
import "./now_playing.scss";

export class NowPlaying extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.onNowPlayingClicked = this.onNowPlayingClicked.bind(this);
    }

    onNowPlayingClicked(event) {
        this.props.onShowNowPlaying(this.props.songid);
    }

    render() {
        return (
            <div className="card mx-2">
                <div className="card-header text-center">
                    <button
                        className="btn btn-primary"
                        onClick={this.onNowPlayingClicked}
                    >
                        Now Playing
                    </button>
                </div>
                <div className="card-body bg-now-playing">
                    <div className="card-text font-weight-bold">{this.props.title}</div>
                    <div className="card-text small">{this.props.album}</div>
                    <div className="card-text small">{this.props.artist}</div>
                </div>
            </div>
        );
    }
}

NowPlaying.propTypes = {
    title: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    songid: PropTypes.number.isRequired,
    onShowNowPlaying: PropTypes.func.isRequired,
};

NowPlaying.defaultProps = {
    onShowNowPlaying: null
};
