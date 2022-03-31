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
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { ajaxSend } from "./ajax_utils";
import "./play_list_scrollable_table.scss";
import "./now_playing.scss";
import {BasePlayList} from "./base_play_list";

export class PlayList extends BasePlayList {
    static SORT_ASC = 1;
    static SORT_INVERT = -1;

    constructor(props) {
        super(props);

        this.messageTimer = null

        // Initial state with empty rows
        this.state = {
            rows: [],
            title: "Current Play List",
            alertMessage: "",
            show_now_playing: false,
            top_song_id: -1,
        };

        this.loadPlayList = this.loadPlayList.bind(this);
        this.playSongNow = this.playSongNow.bind(this);
        this.playSongNext = this.playSongNext.bind(this);
        this.showAlertMessage = this.showAlertMessage.bind(this);
        this.endAlertMessage = this.endAlertMessage.bind(this);
        this.generateRows = this.generateRows.bind(this);
        this.onTableScroll = this.onTableScroll.bind(this);
    }

    // This will load the table when the component is mounted
    componentDidMount() {
        this.loadPlayList();
    }

    componentWillUnmount() {
        if (this.messageTimer !== null) {
            clearInterval(this.messageTimer);
            this.messageTimer = null;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // This is a strange form of one-shot used to show the top/now playing song
        if (this.props.show_top_song) {
            const elmnt = document.getElementById(String(this.props.top_song_id));
            elmnt.scrollIntoView(true);
            // Notify the parent that the top song has been displayed.
            // The parent is expected to reset the show_top_song trigger.
            this.props.onShowingTopSong();
        }
    }

    /*
        PlayList contents

        One play list record
            album	"Identity"
            artist	"Airbag"
            file (or uri)	"mp3/Airbag/Identity/01-01- Prelude.mp3"
            id	"1"
            pos	"0"
            pos1	1
            time	"311"
            track	"Prelude"
    */
    async loadPlayList() {
        const $this = this;

        const data = await $this.getPlayList();
        if (data !== null) {
            // Currently, the data returned is a dict/object with only a playlist property.
            // Eventually, we hope to introduce the notion of a playlist name.
            $this.setState({
                rows: data,
                title: `Current Play List (${data.length} Items)`
            });
        } else {
            const error = "loadPlayList failed"
            $this.setState({ alertMessage: error });
        }
    }

    async playSongNow(row, evt) {
        console.log("play now clicked", row.pos1);
        this.props.onPlayNow(row.pos);
    }

    async playSongNext(row) {
        console.log("play next clicked", row.id);
        await ajaxSend(`/player/nextsong/${row.id}`, "PUT")
        this.showAlertMessage(`${row.track} queued for play next`);
    }

    onTableScroll(evt) {
        console.log("Table scrolled event");
    }

    showAlertMessage(msg) {
        this.setState({alertMessage: msg});
        this.messageTimer = setInterval(this.endAlertMessage, 10000);
    }

    endAlertMessage() {
        clearInterval(this.messageTimer);
        this.messageTimer = null;
        this.setState({alertMessage: ""});
    }

    render() {
        const HeaderComponents = this.generateHeaders();
        const RowComponents = this.generateRows();

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>{this.state.title}</h3>
                    {this.state.alertMessage.length > 0 &&
                        <Alert variant="info">{this.state.alertMessage}</Alert>
                    }
                </div>
                <div className="panel-body">
                    <table
                        className="fixed_header"
                    >
                        <thead>{HeaderComponents}</thead>
                        <tbody>{RowComponents}</tbody>
                        <tfoot/>
                    </table>
                </div>
            </div>
        );
    }

    // Column widths empirically determined
    generateHeaders() {
        return (
            <tr className="">
                <th key="play" className="pl1">Play</th>
                <th key="time" className="pl2">Time</th>
                <th key="title-name-stream" className="pl3">Title/Name/Stream</th>
                <th key="album" className="pl4">Album</th>
                <th key="artist" className="pl5">Artist</th>
                <th key="scrollbar" className="pl6"></th>
            </tr>
        );
    }

    // Generate the rows of the play list
    generateRows() {
        const $this = this;
        const rows = this.state.rows;

        // Guard against race condition loading the play list
        if (rows.length === 0) {
            return (<tr/>);
        }

        return rows.map(function (row) {
            // handle the column data within each row
            let highlight = "";
            if (row.pos1 === $this.props.current_song) {
                highlight = "bg-now-playing"
            }

            const posx = parseInt(row.pos1);
            if ((posx % 2) === 0) {
                highlight = highlight || " row-stripe";
            }

            let queueButton = "";
            if ($this.props.enable_queue_next) {
                queueButton = <Button className="px-2 py-1 mx-1 playlist-button-text"
                                      variant="primary"
                                      size="sm"
                                      onClick={$this.playSongNext.bind(this, row)}
                                      title="Queue for play next"
                >
                    +
                </Button>
            }

            return (
                <tr key={row.id} id={String(row.pos1)} className={highlight}>
                    <td className="pl1">
                        <Button className="px-2 py-1 mx-1 playlist-button-text"
                            variant="primary"
                            size="sm"
                            onClick={$this.playSongNow.bind($this, row)}
                            title="Play now"
                        >
                            {row.pos1}
                        </Button>
                        {queueButton}
                    </td>
                    <td className="pl2">{$this.formatTime(row.time)}</td>
                    <td className="pl3" title={ row.file || row.uri }>{row.track}</td>
                    <td className="pl4">{row.album}</td>
                    <td className="pl5">{row.artist}</td>
                </tr>
            );
        });
    }

    // Technically, this could be overriden by a derived class.
    onCheckChange(event) {
        const row_index = parseInt(event.target.value, 10);
        const name = event.target.name;
        const rows = this.state.rows;

        rows[row_index][name] = !rows[row_index][name];
        this.setState({ rows: rows })
    }
}

PlayList.propTypes = {
    title: PropTypes.string,
    current_song: PropTypes.number,
    default_sort_column: PropTypes.number,
    enable_queue_next: PropTypes.bool,
    onPlayNow: PropTypes.func.isRequired,
    onShowingTopSong: PropTypes.func.isRequired,
    show_top_song: PropTypes.bool,
    top_song_id: PropTypes.number,
};

PlayList.defaultProps = {
    title: "Play List",
    current_song: 1,
    default_sort_column: 0,
    enable_queue_next: true,
    show_top_song: false,
    top_song_id: 1,
};
