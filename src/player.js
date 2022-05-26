/*
    AgentMPDFRB - player component
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
import { Transport } from './components/transport';
import { TrackSlider } from './components/track_slider';
import { VolumeSlider } from './components/volume_slider';
import { NowPlaying } from './components/now_playing';
import { Options } from './components/options';
import { PlayList } from './components/play_list';
import {ajaxGet, ajaxSend} from "./components/ajax_utils";
import {decodeTransportState, STATE_PAUSED, STATE_PLAYING, STATE_STOPPED} from "./components/mpd_utils";
import {transportStateAsString, STATE_UNKNOWN} from "./components/mpd_utils";

export class Player extends React.Component {
    constructor(props) {
        super(props);

        // TODO: Most of these values have to be queried from the server
        this.state = {
            current_song: 1,
            current_state: STATE_UNKNOWN,
            track_position: 0,
            track_duration: 0,
            volume: 50,
            random: false,
            repeat: false,
            consume: false,
            single: false,
            np_album: "",
            np_artist: "",
            np_title: "",
            np_pos1: 1,
            show_top_song: false,
            top_song_id: -1,
            host: null,
            port: -1
        };

        this.statusTimerId = -1;
        // TODO Parameterize interval?
        // With this setup we have an internal update every 1 sec
        // and a server based update every 10 sec
        this.statusTimerInterval = 1 * 1000; // milliseconds
        this.statusUpdateTickCount = 10; // seconds
        this.timerTickCounter = 0; // seconds

        this.onTrackPositionChange = this.onTrackPositionChange.bind(this);
        this.onOptionChanged = this.onOptionChanged.bind(this);
        this.onNowPlayingClicked = this.onNowPlayingClicked.bind(this);
        this.loadCurrentStatus = this.loadCurrentStatus.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onIntervalTimerTick = this.onIntervalTimerTick.bind(this);
        this.onTrackPlay = this.onTrackPlay.bind(this);
        this.onTrackPause = this.onTrackPause.bind(this);
        this.onTrackStop = this.onTrackStop.bind(this);
        this.onTrackFirst = this.onTrackFirst.bind(this);
        this.onTrackNext = this.onTrackNext.bind(this);
        this.onTrackPrevious = this.onTrackPrevious.bind(this);
        this.onTrackLast = this.onTrackLast.bind(this);
        this.onPlayNow = this.onPlayNow.bind(this);
        this.onNowPlaying = this.onNowPlaying.bind(this);
        this.onShowingTopSong = this.onShowingTopSong.bind(this);
        this.onKeyStroke = this.onKeyStroke.bind(this);
    }

    // This will initialize the player when the component is mounted
    componentDidMount() {
        // Load status once then periodically
        this.loadCurrentStatus();
        this.statusTimerId = setInterval(this.onIntervalTimerTick, this.statusTimerInterval);

        // Capture keystrokes
        document.addEventListener('keypress', this.onKeyStroke);
    }

    componentWillUnmount() {
        if (this.statusTimerId > 0) {
            clearInterval(this.statusTimerId);
            this.statusTimerId = -1;
        }
        // Remove the key handler
        document.removeEventListener("keypress", this.onKeyStroke);
    }

    // Support space bar as a play/pause control
    async onKeyStroke(event) {
        console.log("Keystroke: " + String(event.keyCode));
        if (event.keyCode === 32 && event.target === document.body) {
            switch (this.state.current_state) {
                case STATE_PLAYING:
                    await this.onTrackPause();
                    break;
                case STATE_PAUSED:
                case STATE_STOPPED:
                    await this.onTrackPlay();
                    break;
            }
            // Note that under Firefox this does not seem to work
            event.preventDefault();
            return false;
        }
        return true;
    }

    onIntervalTimerTick() {
        this.timerTickCounter += 1;
        if (this.timerTickCounter === this.statusUpdateTickCount) {
            // Time to update from server
            this.loadCurrentStatus();
            this.timerTickCounter = 0;
        } else if (this.state.current_state === STATE_PLAYING) {
            // Interim update
            const next_position = this.state.track_position + 1;
            if (next_position <= this.state.track_duration) {
                this.setState({track_position: next_position});
            } else {
                // Start of new track
                this.setState({track_position: 0});
            }
        }
    }

    async loadCurrentStatus() {
        const $this = this;

        const data = await ajaxGet('/player/currentstatus');

        // Only get the host infor when it is unknown
        if ($this.state.host === null) {
            const settings = await ajaxGet("/settings");
            $this.setState({
                host: settings.host,
                port: settings.port
            });
        }

        if (data !== null) {
            const mpd_state = decodeTransportState(data.state);
            console.log("MPD state: " + transportStateAsString(mpd_state));

            $this.setState({
                current_song: parseInt(data.pos1),
                current_state: mpd_state,
                volume: parseInt(data.volume),
                track_position: mpd_state === STATE_STOPPED ? 0: parseInt(data.elapsed),
                track_duration: isNaN(data.duration) ? 0: parseInt(data.duration),
                np_album: data.album,
                np_artist: data.artist,
                np_title: data.title,
                np_pos1: parseInt(data.pos1),
                random: data.random === "1",
                repeat: data.repeat === "1",
                consume: data.consume === "1",
                single: data.single === "1",
            });
        } else {
            const error = "loadCurrentStatus failed"
            $this.setState({ errorMessage: error });
            console.error('AJAX error', error);
        }
    }

    // Now Playing button click handler
    onNowPlayingClicked(event) {
        // All handled inside of the now playing component
    }

    // Play now was used from playlist
    async onPlayNow(pos) {
        // pos - 0-n is the song ID to be played
        await ajaxSend(`/player/currentsong/${pos}`, "PUT")
        await this.loadCurrentStatus();
    }

    // Previous transport button clicked
    async onTrackPrevious(event) {
        await ajaxSend("/player/currentsong/previous", "PUT", {});
        await this.loadCurrentStatus();
    }

    // First transport button clicked
    async onTrackFirst(event) {
        await ajaxSend("/player/currentsong/first", "PUT", {});
        await this.loadCurrentStatus();
    }

    // Next transport button clicked
    async onTrackNext(event) {
        await ajaxSend("/player/currentsong/next", "PUT", {});
        await this.loadCurrentStatus();
    }

    // Last transport button clicked
    async onTrackLast(event) {
        await ajaxSend("/player/currentsong/last", "PUT", {});
        await this.loadCurrentStatus();
    }

    // Track position slider change handler
    onTrackPositionChange(event) {
        this.setState({track_position: parseInt(event.target.value)});
    }

    async onTrackPlay() {
        await this.loadCurrentStatus();
        switch (this.state.current_state) {
            case STATE_STOPPED:
                console.log("Playing from stop");
                await ajaxSend("/player/status", "PUT", {playstatus: "play"});
                break;
            case STATE_PAUSED:
                console.log("Toggling pause to play");
                await ajaxSend("/player/status", "PUT", {playstatus: "toggle"});
                break;
            default:
                break;
        };

        await this.loadCurrentStatus();
    }

    async onTrackPause() {
        await this.loadCurrentStatus();
        switch (this.state.current_state) {
            case STATE_PLAYING:
                await ajaxSend("/player/status", "PUT", {playstatus: "toggle"});
                break;
            default:
                break;
        };

        await this.loadCurrentStatus();
    }

    async onTrackStop() {
        console.log("onStop called while at state: " + this.state.current_state);
        console.log("Stopping from state: " + this.state.current_state);
        await ajaxSend("/player/status", "PUT", {playstatus: "stop"});

        await this.loadCurrentStatus();
    }

    // Trigger the playlist to show the now playing song
    onNowPlaying(songid) {
        this.setState({show_top_song: true, top_song_id: songid});
    }

    // The now playing song has been shown
    onShowingTopSong() {
        this.setState({show_top_song: false});
    }

    // Playback option change handler
    async onOptionChanged(option_name, checked) {
        let newState = {[option_name]: checked};

        // Update MPD
        await ajaxSend("/player/status", "PUT", newState);
        this.setState(newState);
        console.log("Option changed: " + JSON.stringify(newState));
    }

    render() {
        // Account for unknown host
        let host_info = "?";
        if (this.state.host !== null) {
            host_info = this.state.host + ":" + String(this.state.port);
        }

         return (
           <div className="panel panel-default">
                <div className="jumbotron text-center h-25 p-1 mt-2 mb-5">
                    <h1 className="text-primary">MPD Player on {host_info}</h1>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Transport
                                currentState={this.state.current_state}
                                onFirst={this.onTrackFirst}
                                onPrevious={this.onTrackPrevious}
                                onPlay={this.onTrackPlay}
                                onPause={this.onTrackPause}
                                onStop={this.onTrackStop}
                                onNext={this.onTrackNext}
                                onLast={this.onTrackLast}
                                size="md"
                            >
                            </Transport>
                            <TrackSlider
                                position={this.state.track_position}
                                duration={this.state.track_duration}
                                playing={this.state.current_state === STATE_PLAYING}
                                onChange={this.onTrackPositionChange}
                            />
                            <VolumeSlider
                                initialVolume={this.state.volume}
                            >
                            </VolumeSlider>
                        </div>
                        <div className="col">
                            <NowPlaying
                                title={`[${this.state.np_pos1}] ${this.state.np_title}`}
                                album={this.state.np_album}
                                artist={this.state.np_artist}
                                songid={this.state.np_pos1}
                                onShowNowPlaying={this.onNowPlaying}
                            >
                            </NowPlaying>
                        </div>
                        <div className="col">
                            <Options
                                random={this.state.random}
                                consume={this.state.consume}
                                repeat={this.state.repeat}
                                single={this.state.single}
                                onChanged={this.onOptionChanged}
                            >
                            </Options>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm mt-4">
                            <PlayList
                                current_song={this.state.current_song}
                                enable_queue_next={this.state.random}
                                show_top_song={this.state.show_top_song}
                                top_song_id={this.state.top_song_id}
                                onPlayNow={this.onPlayNow}
                                onShowingTopSong={this.onShowingTopSong}
                            >
                            </PlayList>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
