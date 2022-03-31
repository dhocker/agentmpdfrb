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
/*
    Modal dialog with form: https://dev.to/kimmese/react-bootstrap-modal-form-31gc
*/

import React from "react";
import {EditablePlayList} from "./components/editable_play_list";
import {ajaxGet, ajaxSend} from "./components/ajax_utils";
import {Form, Row, Col, Container, Button, InputGroup, FormControl} from "react-bootstrap";
import {SearchDialog} from "./components/search_dlg";
import {MessageDialog} from "./components/message_dlg";
import {SavePlaylistDialog} from "./components/save_playlist_dialog";
import {MultiSelectListbox} from "./components/multi_select_listbox";


export class EditPlaylist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playlists: [],
            artists: [1, 2, 3, 4, 5],
            albums: [],
            track_titles: [],
            tracks: [],
            reload_playlist: 0,
            show_search_dialog: false,
            search_option: 0,
            search_text: "",
            playlist_name: "",
            message_title: "",
            message_text: "",
        };

        this.uriEntered = "";
        this.selectedPlaylists = [];
        this.selectedAlbums = [];
        this.selectedTracks = [];

        this.loadPlaylists = this.loadPlaylists.bind(this);
        this.loadArtists = this.loadArtists.bind(this);
        this.loadAlbums = this.loadAlbums.bind(this);
        this.reloadPlaylist = this.reloadPlaylist.bind(this);
        this.onAlbumsSelected = this.onAlbumsSelected.bind(this);
        this.onArtistsSelected = this.onArtistsSelected.bind(this);
        this.onAddUri = this.onAddUri.bind(this);
        this.onUriChanged = this.onUriChanged.bind(this);
        this.onSavePlaylist = this.onSavePlaylist.bind(this);
        this.onSaveNamedPlaylist = this.onSaveNamedPlaylist.bind(this);
        this.onCancelSaveNamedPlaylist = this.onCancelSaveNamedPlaylist.bind(this);
        this.onClearPlaylist = this.onClearPlaylist.bind(this);
        this.onAddSelectedPlaylists = this.onAddSelectedPlaylists.bind(this);
        this.onAddSelectedAlbums = this.onAddSelectedAlbums.bind(this);
        this.onAddAllTracks = this.onAddAllTracks.bind(this);
        this.onAddSelectedTracks = this.onAddSelectedTracks.bind(this);
        this.addTracks = this.addTracks.bind(this);
        this.onResetSearch = this.onResetSearch.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onExecSearch = this.onExecSearch.bind(this);
        this.onCancelSearch = this.onCancelSearch.bind(this);
        this.searchForPlaylists = this.searchForPlaylists.bind(this);
        this.searchForAlbums = this.searchForAlbums.bind(this);
        this.searchForAlbumsByArtist = this.searchForAlbumsByArtist.bind(this);
        this.searchForTracks = this.searchForTracks.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.onCloseMessage = this.onCloseMessage.bind(this);
        this.onDeletePlaylists = this.onDeletePlaylists.bind(this);
        this.onSelectPlaylists =  this.onSelectPlaylists.bind(this);
    }

    async componentDidMount() {
        await this.loadPlaylists();
        await this.loadArtists();
        await this.loadAlbums();
    }

    // Load all known playlists
    async loadPlaylists() {
        const $this = this;

        const data = await ajaxGet('/cpl/namedplaylists');
        if (data !== null) {
            // Currently, the data returned is a dict/object with only a playlists property.
            // Eventually, we hope to introduce the notion of a playlist name.
            $this.setState({
                playlists: data.playlists
            });
        } else {
            const error = "loadPlayLists failed"
            $this.setState({alertMessage: error});
            console.error('AJAX error', error);
        }
        return null;
    }

    // Load the list of all known artists
    async loadArtists() {
        const $this = this;

        const data = await ajaxGet('/cpl/artists');
        if (data !== null) {
            // Currently, the data returned is a dict/object with only an artists property.
            $this.setState({
                artists: data.artists
            });
        } else {
            const error = "loadArtists failed"
            $this.setState({alertMessage: error});
            console.error('AJAX error', error);
        }
        return null;
    }

    // Load albums
    // forArtists: an artist of interest or null for all artists
    async loadAlbums(forArtists = null) {
        const $this = this;

        // Search args?
        let searchArgs = null;
        if (forArtists !== null) {
            searchArgs = {artists: JSON.stringify(forArtists)};
        }

        const data = await ajaxGet('/cpl/albums', searchArgs);
        if (data !== null) {
            // Currently, the data returned is a dict/object with only a albums property.
            $this.setState({
                albums: data.albums
            });
        } else {
            const error = "loadArtists failed"
            $this.setState({alertMessage: error});
            console.error('AJAX error', error);
        }
        return null;
    }

    // Load all tracks for each album in the list
    async loadTracks(albums) {
        const $this = this;

        const data = await ajaxGet('/cpl/album/tracks', albums);
        if (data !== null) {
            // Currently, the data returned is a dict/object with only a tracks property.
            // Each track has a title and a uri.
            let titles = [];
            let tracks = [];
            for (let i = 0; i < data.tracks.length; i++) {
                titles.push(data.tracks[i].title);
                tracks.push(data.tracks[i]);
            }
            $this.setState({
                track_titles: titles,
                tracks: tracks
            });
        } else {
            const error = "loadTracks failed"
            $this.setState({alertMessage: error});
            console.error('AJAX error', error);
        }
        return null;
    }

    // Show the save playlist dialog
    onSavePlaylist(evt) {
        console.log("Save playlist");
        this.setState({show_save_playlist: true});
    }

    // Save the current playlist contents as a named playlist
    async onSaveNamedPlaylist(evt) {
        // Reload the playlist listbox to pick up the newly save playlist
        await this.loadPlaylists();

        this.setState({show_save_playlist: false});
        this.showMessage("Save Named Playlist",
            "The current playlist was saved under the name " + this.state.playlist_name);
    }

    // Cancel the save dialog
    onCancelSaveNamedPlaylist(evt) {
        console.log("Cancel save named playlist");
        this.setState({show_save_playlist: false});
    }

    // Clear the entire contents of the playlist
    async onClearPlaylist(evt) {
        await ajaxSend("/cpl/playlist", "delete", null);
        console.log("Clear playlist");
        this.reloadPlaylist();
    }

    onSearch(evt) {
        console.log("Search");
        this.setState({show_search_dialog: true})
    }

    async onResetSearch(evt) {
        console.log("Reset search");
        await this.loadPlaylists();
        await this.loadArtists();
        await this.loadAlbums();
        // This resets the search text and it must come AFTER reloading
        // the list boxes because those calls are async.
        this.setState({search_text: "", tracks: []});
    }

    async onAddSelectedPlaylists(evt) {
        console.log("Add selected playlists: " + this.selectedPlaylists);

        if (this.selectedPlaylists.length > 0) {
            // The arg list is an object containing the "playlists" key.
            // This structure is dictated by Flask.
            const arg_list = {"playlists": this.selectedPlaylists};

            await ajaxSend("/cpl/playlist","post", arg_list);

            // Reload the editable playlist
            this.reloadPlaylist();
        }
    }

    onSelectPlaylists(selected_playlists) {
        // How to capture the selected option values
        this.selectedPlaylists = selected_playlists;

        // Remember the first selected playlist as the save playlist suggestion
        if (this.selectedPlaylists.length > 0) {
            this.setState({playlist_name: this.selectedPlaylists[0]});
        }
        console.log("Playlists: " + this.selectedPlaylists)
    }

    onSelectTracks(ev) {
        // How to capture the selected option values
        // This is the track name, but we need the URI.
        this.selectedTracks = [];
        for (let i = 0; i < ev.target.selectedOptions.length; i++) {
            // this should be the uri
            const selected_track_index = ev.target.selectedOptions[i].value;
            this.selectedTracks.push(this.state.tracks[selected_track_index]);
        }
        console.log("Selected tracks: " + this.selectedTracks)
    }

    async onArtistsSelected(selected_artists) {
        if (selected_artists.length > 0) {
            await this.loadAlbums(selected_artists);
        }
        console.log("Selected artists: " + selected_artists)
    }

    async onAlbumsSelected(selected_albums) {
        if (selected_albums.length > 0) {
            await this.loadTracks(selected_albums);
        }
        console.log("Selected albums: " + selected_albums)
    }

    onUriChanged(evt) {
        console.log("URI: " + evt.target.value);
        this.uriEntered = evt.target.value;
    }

    onAddUri(evt) {
        console.log("AddURI clicked: " + this.uriEntered);
        this.showMessage("Add URI", "Not implemented");
    }

    async onAddSelectedAlbums(evt) {
        console.log("Add selected albums: " + this.selectedAlbums);
        await this.onAddAllTracks(evt);
    }

    async onAddAllTracks(evt) {
        console.log("Add all tracks");
        await this.addTracks(this.state.tracks);
    }

    async onAddSelectedTracks(evt) {
        console.log("Add selected tracks: " + this.selectedTracks);
        await this.addTracks(this.selectedTracks);
    }

    async addTracks(tracks) {
        console.log("Add all tracks");

        // Collect all the URIs for tracks
        let track_uris = [];
        for (let i = 0; i < tracks.length; i++) {
            track_uris.push(tracks[i].uri);
        }

        let arg_list = {uris: track_uris};
        await ajaxSend("/cpl/playlist","post", arg_list);

        // Pick up added tracks in playlist
        this.reloadPlaylist();
    }

    reloadPlaylist() {
        // Reload the editable playlist
        // This is mostly a hack, but it does cause the component to update
        this.setState({reload_playlist: this.state.reload_playlist + 1});
    }

    async onExecSearch(search_text, search_option) {
        if (search_text.length <= 0) {
            console.log("No search text");
            return;
        }

        console.log("Execute search");

        switch (search_option) {
            case 0:
                // Search for playlists
                await this.searchForPlaylists(search_text);
                break;
            case 1:
                // Search for albums
                await this.searchForAlbums(search_text);
                break;
            case 2:
                // Search for albums by an artist
                await this.searchForAlbumsByArtist(search_text);
                break;
            case 3:
                // Search for tracks by name containing string
                await this.searchForTracks(search_text);
                break;
            default:
                console.log("Unrecognized search option")
        }
        this.setState({show_search_dialog: false});
    }

    onCancelSearch() {
        console.log("Cancel search")
        this.setState({show_search_dialog: false});
    }

    async searchForPlaylists(search_text) {
        const data = await ajaxGet('/cpl/namedplaylists', {s: search_text});
        if (data !== null) {
            console.log("Search for playlists: " + JSON.stringify(data.playlists));
            this.setState({playlists: data.playlists});
        } else {
            console.log("Unexpected null result");
        }
        return null;
    }

    async searchForAlbums(search_text) {
        const data = await ajaxGet('/cpl/albums', {album: search_text});
        if (data !== null) {
            console.log("Search for albums: " + JSON.stringify(data.playlists));
            this.setState({albums: data.albums});
        } else {
            console.log("Unexpected null result");
        }
        return null;
    }

    async searchForAlbumsByArtist(search_text) {
        const data = await ajaxGet('/cpl/albums', {artist: search_text});
        if (data !== null) {
            console.log("Search for albums by artist: " + JSON.stringify(data.playlists));
            this.setState({albums: data.albums});
        } else {
            console.log("Unexpected null result");
        }
        return null;
    }

    async searchForTracks(search_text) {
        const data = await ajaxGet('/cpl/tracks', {track: search_text});
        if (data !== null) {
            console.log("Search for tracks: " + JSON.stringify(data.tracks));
            this.setState({tracks: data.tracks});
        } else {
            console.log("Unexpected null result");
        }
        return null;
    }

    onDeletePlaylists() {
        this.showMessage("Delete Playlists", "Not implemented");
    }

    showMessage(title, text) {
        this.setState({message_title: title, message_text: text, show_message: true});
    }

    onCloseMessage() {
        this.setState({show_message: false});
    }

    // Generate a multi-select list box for tracks
    // rows - an array of objects containing title and uri
    renderMultiSelectTracksListBox(rows, controlId, name, label, changeHandler) {
        let keyval = 0;
        const renderedRows = rows.map(function (row) {
            // handle the column data within each row
            keyval += 1;
            // Use defaultValue or value on select to set selected
            return (
                <option key={String(keyval)} value={keyval - 1}>{row.title}</option>
            );
        });

        // There are issues with the "multiple" property
        return (
            <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    id={controlId}
                    name={name}
                    as="select"
                    defaultValue={[]}
                    onChange={changeHandler.bind(this)}
                    style={{height: '250px'}}
                    multiple
                >
                    {renderedRows}
                </Form.Control>
            </Form.Group>
        );
    }

    // Generate a multi-select list box
    renderMultiSelectListBox(rows, controlId, name, label, changeHandler) {
        let keyval = 0;
        const renderedRows = rows.map(function (row) {
            // handle the column data within each row
            keyval += 1;
            // Use defaultValue or value on select to set selected
            return (
                <option key={keyval} value={row}>{row}</option>
            );
        });

        // There are issues with the "multiple" property
        return (
            <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    id={controlId}
                    name={name}
                    as="select"
                    defaultValue={[]}
                    onChange={changeHandler.bind(this)}
                    style={{height: '250px'}}
                    multiple
                >
                    {renderedRows}
                </Form.Control>
            </Form.Group>
        );
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="jumbotron text-center h-25 p-1 my-2">
                    <h1 className="text-primary">Edit the Current Playlist</h1>
                </div>
                <div>
                    <Button
                        className="mt-3 mb-3"
                        variant="success"
                        onClick={this.onSavePlaylist}
                        title="Save current playlist as a named playlist"
                    >
                        Save Playlist
                    </Button>
                    <Button
                        className="mt-3 mb-3 ms-3"
                        variant="danger"
                        onClick={this.onDeletePlaylists}
                        title="Delete selected named playlists"
                    >
                        Delete Playlists
                    </Button>
                    <Button
                        className="mt-3 mb-3 ms-3"
                        variant="danger"
                        onClick={this.onClearPlaylist}
                        title="Clear the current playlist"
                    >
                        Clear Current Playlist
                    </Button>
                    <Button className="mt-3 mb-3 ms-3 float-end" variant="warning" onClick={this.onResetSearch}>
                        Reset Search
                    </Button>
                    <Button className="mt-3 mb-3 ms-3 float-end" onClick={this.onSearch}>
                        Search
                    </Button>
                </div>
                <Container fluid className="border border-dark rounded pb-3">
                    <Row>
                        <Col md={3}>
                            <MultiSelectListbox
                                rows={this.state.playlists}
                                controlId={"playlistsId"}
                                name={"playlists"}
                                label={"Named Playlists"}
                                onSelect={this.onSelectPlaylists}
                            />
                        </Col>
                        <Col>
                            <MultiSelectListbox
                                rows={this.state.artists}
                                controlId={"artistsId"}
                                name={"artists"}
                                label={"Artists"}
                                onSelect={this.onArtistsSelected}
                            />
                        </Col>
                        <Col>
                            <MultiSelectListbox
                                rows={this.state.albums}
                                controlId={"albumsId"}
                                name={"albums"}
                                label={"Albums"}
                                onSelect={this.onAlbumsSelected}
                            />
                        </Col>
                        <Col>
                            {this.renderMultiSelectTracksListBox(this.state.tracks,
                                "tracksId",
                                "tracks",
                                "Tracks",
                                this.onSelectTracks)
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button className="mt-3" onClick={this.onAddSelectedPlaylists}>
                                Add Selected Playlist(s)
                            </Button>
                            <br></br>
                            <InputGroup className="mt-3">
                                <FormControl
                                    id="uri"
                                    placeholder="URI"
                                    onChange={this.onUriChanged}
                                />
                                <Button className="" onClick={this.onAddUri}>
                                    Add URI
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col>

                        </Col>
                        <Col>
                            <Button className="mt-3" onClick={this.onAddSelectedAlbums}>
                                Add Selected Albums(s)
                            </Button>
                        </Col>
                        <Col>
                            <Button className="mt-3" onClick={this.onAddAllTracks}>
                                Add All Tracks
                            </Button>
                            <br></br>
                            <Button className="mt-3" onClick={this.onAddSelectedTracks}>
                                Add Selected Track(s)
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <Container fluid className="mt-3 pb-3">
                    <EditablePlayList
                        default_sort_column={1}
                        reload={this.state.reload_playlist}
                    >
                    </EditablePlayList>
                </Container>

                <SavePlaylistDialog
                    show={this.state.show_save_playlist}
                    playlist_name={this.state.playlist_name}
                    onSave={this.onSaveNamedPlaylist}
                    onCancel={this.onCancelSaveNamedPlaylist}
                />

                <SearchDialog
                    show={this.state.show_search_dialog}
                    onExecuteSearch={this.onExecSearch}
                    onCancelSearch={this.onCancelSearch}
                />

                <MessageDialog
                    show={this.state.show_message}
                    title={this.state.message_title}
                    message={this.state.message_text}
                    onOK={this.onCloseMessage}
                />
           </div>
        );
    }
}
