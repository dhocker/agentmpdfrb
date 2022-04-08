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
import { Row, Col } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import { ajaxSend } from "./ajax_utils";
import "./play_list_scrollable_table.scss";
import {BasePlayList} from "./base_play_list";
import {SortDownIcon} from "./sort_icons";

export class EditablePlayList extends BasePlayList {
    static SORT_ASC = 1;
    static SORT_INVERT = -1;

    constructor(props) {
        super(props);

        this.messageTimer = null
        this.reload_playlist = props.reload;
        this.select_all = true;
        this.sort_title_desc = false;
        this.sort_album_desc = false;
        this.sort_artist_desc = false;

        // Initial state with empty rows
        this.state = {
            rows: [],
            alertMessage: "",
            rows_selected: 0,
        };

        this.loadPlayList = this.loadPlayList.bind(this);
        this.showAlertMessage = this.showAlertMessage.bind(this);
        this.endAlertMessage = this.endAlertMessage.bind(this);
        this.generateRows = this.generateRows.bind(this);
        this.onRemoveSelected = this.onRemoveSelected.bind(this);
        this.onSelectChanged = this.onSelectChanged.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onSortByTitle = this.onSortByTitle.bind(this);
        this.onSortByAlbum = this.onSortByAlbum.bind(this);
        this.onSortByArtist = this.onSortByArtist.bind(this);
        this.uploadUpdatedPlaylist = this.uploadUpdatedPlaylist.bind(this);
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
        if (this.reload_playlist !== this.props.reload) {
            this.loadPlayList();
            this.reload_playlist = this.props.reload;
            console.log("Editable playlist did update");
        }
    }

    async loadPlayList() {
        const $this = this;

        const data = await $this.getPlayList();
        if (data !== null) {
            // Currently, the data returned is a dict/object with only a playlist property.
            // Eventually, we hope to introduce the notion of a playlist name.

            // Add selected property to each row
            for (let i = 0; i < data.length; i++) {
                data[i].selected = false;
            }

            $this.setState({
                rows: data,
                title: `Current Play List (${data.length} Items)`
            });
        } else {
            const error = "loadPlayList failed"
            $this.setState({ alertMessage: error });
        }

        return data;
    }

    async uploadUpdatedPlaylist() {
        // Replace the entire mpd playlist with an updated
        // playlist. Typically, the playlist will be sorted.
        // Clear the mpd playlist
        await ajaxSend('/cpl/playlist', "DELETE");

        // Send the updated playlist
        const all_tracks = []
        const pl = this.state.rows;
        for (let i = 0; i < pl.length; i++) {
            all_tracks.push(pl[i].file || pl[i].uri);
        }
        await ajaxSend('/cpl/playlist', "POST", {"uris" : all_tracks});
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

    onSelectChanged(evt) {
        const target = evt.target;
        const checked = target.checked;
        const value = target.value;
        const row_index = parseInt(value) - 1;
        this.state.rows[row_index]["selected"] = checked;

        // Count how many rows are checked
        let selected = 0;
        for (let i = 0; i < this.state.rows.length; i++) {
            if (this.state.rows[i]["selected"]) {
                selected = selected + 1;
            }
        }

        this.setState({rows: this.state.rows, rows_selected: selected});
    }

    async onRemoveSelected() {
        console.log("Remove selected tracks from playlist")
        // Collect the IDs of tracks to be removed
        let playlist_ids = [];
        for (let i = 0; i < this.state.rows.length; i++) {
            if (this.state.rows[i]["selected"]) {
                console.log(String(this.state.rows[i]["id"]));
                playlist_ids.push(this.state.rows[i]["id"]);
            }
        }

        // Remove selected items by dong/track ID and reload the playlist
        if (playlist_ids.length > 0) {
            await ajaxSend("/cpl/playlistentry", "delete", playlist_ids);
            await this.loadPlayList();
        }
    }

    // Selecte/deselect all rows
    onSelectAll(evt) {
        console.log("Select/deselect all");
        for (let i = 0; i < this.state.rows.length; i++) {
            this.state.rows[i].selected = this.select_all;
        }

        this.setState({rows: this.state.rows, rows_selected: this.select_all});

        // Invert selection all/none
        this.select_all = !this.select_all;
    }

    // Sort playlist by title
    onSortByTitle(evt) {
        console.log("Sort by title");
        this.state.rows.sort(sort_array_by("track", this.sort_title_desc));
        this.setState({rows: this.state.rows});
        this.sort_title_desc = !this.sort_title_desc;
        // Update mpd playlist
        this.uploadUpdatedPlaylist();
    }

    // Sort playlist by album
    onSortByAlbum(evt) {
        console.log("Sort by album");
        this.state.rows.sort(sort_array_by("album", this.sort_album_desc));
        this.setState({rows: this.state.rows});
        this.sort_album_desc = !this.sort_album_desc;
        // Update mpd playlist
        this.uploadUpdatedPlaylist();
    }

    // Sort playlist by artist
    onSortByArtist(evt) {
        console.log("Sort by artist");
        this.state.rows.sort(sort_array_by("artist", this.sort_artist_desc));
        this.setState({rows: this.state.rows});
        this.sort_artist_desc = !this.sort_artist_desc;
        // Update mpd playlist
        this.uploadUpdatedPlaylist();
    }

    render() {
        const HeaderComponents = this.generateHeaders();
        const RowComponents = this.generateRows();

        return (
            <div className="panel panel-default">
                <div className="panel-heading container">
                    <Row>
                        <Col className="ms-0 ps-0">
                            <Button
                                className="mb-3"
                                onClick={this.onRemoveSelected}
                                disabled={this.state.rows_selected <= 0}
                            >
                                Remove Selected
                            </Button>
                        </Col>
                        <Col>
                            <h3>
                                {this.state.title}
                            </h3>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
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
                    <Button
                        className="mt-3 mb-3"
                        onClick={this.onRemoveSelected}
                        disabled={this.state.rows_selected <= 0}
                    >
                        Remove Selected
                    </Button>
                </div>
            </div>
        );
    }

    // Column widths empirically determined
    generateHeaders() {
        return (
            <tr className="">
                <th key="Select" className="pl1">
                    <Button onClick={this.onSelectAll}>
                        Select
                    </Button>
                </th>
                <th key="time" className="pl2">Time</th>
                <th key="title-name-stream" className="pl3">
                    <Button onClick={this.onSortByTitle}>
                        Title/Name/Stream
                        <SortDownIcon/>
                    </Button>
                </th>
                <th key="album" className="pl4">
                    <Button onClick={this.onSortByAlbum}>
                        Album
                        <SortDownIcon/>
                    </Button>
                </th>
                <th key="artist" className="pl5">
                    <Button onClick={this.onSortByArtist}>
                        Artist
                        <SortDownIcon/>
                    </Button>
                </th>
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
            const posx = parseInt(row.pos1);
            if ((posx % 2) === 0) {
                highlight = "row-stripe";
            }

            return (
                <tr key={row.id} id={String(row.pos1)} className={highlight}>
                    <td className="pl1">
                        <input type="checkbox" checked={row["selected"]} name={String(row.pos1)}
                          value={row.pos1} onChange={$this.onSelectChanged}
                        />
                    </td>
                    <td className="pl2">{$this.formatTime(row.time)}</td>
                    <td className="pl3" title={ row.file || row.uri }>{row.track}</td>
                    <td className="pl4">{row.album}</td>
                    <td className="pl5">{row.artist}</td>
                </tr>
            );
        });
    }
}

EditablePlayList.propTypes = {
    default_sort_column: PropTypes.number,
    reload: PropTypes.number,
};

EditablePlayList.defaultProps = {
    default_sort_column: 1,
    reload: 0,
};

/*
Returns a comparator function that compares the specified
property of an object. This is useful for sorting an
array of objects by an object property.
*/
// TODO Refactor this function
function sort_array_by(propname, desc) {
    var reverse = 1;
    // If desc is truthy, the sort is descending or reversed
    if (typeof(desc) != 'undefined') {
        reverse = (desc) ? -1 : 1;
    }
    return function(a, b) {
        // Make the sort case insensitive
        if (typeof(a[propname]) != 'string') {
            a = a[propname];
            b = b[propname];
        }
        else {
            a = a[propname].toLowerCase();
            b = b[propname].toLowerCase();
        }
        if (a < b) {
            return reverse * -1;
        }
        if (a > b) {
            return reverse * 1;
        }
        return 0;
    }
}
