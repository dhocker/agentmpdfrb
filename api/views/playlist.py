#
# AgentMPD - web app for controlling an mpd instance
# Copyright © 2022  Dave Hocker (email: AtHomeX10@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the LICENSE file for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
#
# A reasonable attempt was made to design this part of the app along the lines of REST.
# The following collections are involved.
#   - The current playlist is a collection of songs/tracks/URIs.
#   - Named/stored playlists
#   - Albums
#
# The following records/members/elements are involved.
#   - Tracks/songs/URIs

from api import app
from api.models.playlist import Playlist
from api.views.url_utils import url_with_prefix
from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, jsonify
import json


@app.route(url_with_prefix("/cpl/playlist"), methods=['DELETE'])
def clear_playlist():
    """
    Remove all entries from the current playlist (collection).
    :return:
    """
    playlist = Playlist()
    playlist.clear()
    return ""


@app.route(url_with_prefix("/cpl/managecurrentplaylist"), methods=['GET'])
def manage_playlist():
    """
    Show the manage current playlist page.
    :return:
    """
    return render_template("manage_playlist.html", ngapp="agentmpd", ngcontroller="playlistController")


@app.route(url_with_prefix("/cpl/currentplaylist"), methods=['GET'])
def get_current_playlist():
    playlist = Playlist()
    pl = playlist.get_current_playlist()
    return jsonify(**pl)


@app.route(url_with_prefix("/cpl/namedplaylists"), methods=['GET'])
def get_all_named_playlists():
    """
    Return a collection of named/stored playlists.
    If a search/query parameter ("s") is provided, the
    queried playlists are returned. Otherwise, all
    playlists are returned.
    :return:
    """
    playlist = Playlist()
    if len(request.args) > 0:
        all_playlists = playlist.search_for_playlists(request.args["s"])
    else:
        all_playlists = playlist.get_playlists()

    return jsonify({"playlists": all_playlists})


@app.route(url_with_prefix("/cpl/artists"), methods=['GET'])
def get_artists():
    """
    Return a collection of artists.
    If a search/query parameter ("s") is provided, the
    queried artists are returned. Otherwise, all
    artists are returned.
    :return:
    """
    playlist = Playlist()
    if len(request.args) > 0:
        #all_artists = playlist.search_for_playlists(request.args["s"])
        all_artists = []
    else:
        all_artists = playlist.get_artists()

    return jsonify({"artists": all_artists})


@app.route(url_with_prefix("/cpl/playlist"), methods=['POST'])
def append_stored_playlists():
    """
    Append to the current playlist the contents of one or more stored playlists.
    The request data contains an object/dict identfifying the playlists to be appended.
    :return:
    """
    args = json.loads(request.data.decode("utf-8"))["data"]
    playlist = Playlist()
    if "playlists" in args:
        playlist.load_playlists(args["playlists"])
    elif "uris" in args:
        for uri in args["uris"]:
            playlist.add_track(uri)
    return ""


@app.route(url_with_prefix("/cpl/namedplaylists"), methods=['DELETE'])
def delete_stored_playlists():
    """
    Delete named playlists from the playlist directory.
    The request data contains an object/dict identifying the playlists to be deleted.
    :return:
    """
    args = json.loads(request.data.decode("utf-8"))["data"]
    playlist = Playlist()
    if "playlists" in args:
        playlist.delete_playlists(args["playlists"])
    return ""


@app.route(url_with_prefix("/cpl/playlistentry"), methods=['DELETE'])
def remove_playlist_entries():
    """
    Remove one or more entries from the current playlist.
    The request data is an array of songids
    to be removed from the current playlist.
    :return:
    """
    songids = json.loads(request.data.decode("utf-8"))["data"]
    playlist = Playlist()
    for songid in songids:
        playlist.remove_by_songid(songid)
    return ""


@app.route(url_with_prefix("/cpl/albums"), methods=['GET'])
def get_all_albums():
    """
    Get albums in the library. If there are search args, the list of
    albums returned will be based on queries using the search args.
    Search args are:
        album - name of album to search for (found albums with contain the search arg)
        artist - search for albums by the artist (exact match on artist)
        artists - search for albums by a list of artists (exact match on each artist)
    Note that this behavior is somewhat inconsistent. Unfortunately, this reflects
    the way that mpd actually works.
    :return:
    """
    playlist = Playlist()
    if len(request.args) > 0:
        if "album" in request.args:
            # Query for albums
            all_albums = playlist.search_for_albums(request.args["album"])
        elif "artist" in request.args:
            # Query for albums by artist
            all_albums = playlist.search_for_albums_by_artist(request.args["artist"])
            # The returned list is a list of dicts where each dict contains one
            # key, namely "album". Here we translate the list of dicts to a
            # list of album names.
            all_albums = list(map(lambda album: album["album"], all_albums))
        elif "artists" in request.args:
            # Query for albums by artist(s)
            artists = json.loads(request.args["artists"])
            if type(artists) != list:
                artists = [request.args["artists"]]
            all_albums = playlist.search_for_albums_by_artists(artists)
            # The returned list is a list of dicts where each dict contains one
            # key, namely "album". Here we translate the list of dicts to a
            # list of album names.
            all_albums = list(map(lambda album: album["album"], all_albums))
        else:
            all_albums = []
    else:
        all_albums = playlist.get_albums()

    all_albums.sort()
    return jsonify({"albums": all_albums})


@app.route(url_with_prefix("/cpl/album/tracks"), methods=['GET'])
def get_album_tracks():
    """
    Get the tracks contained in one or more albums.
    The request data is an array of album titles.
    :return:
    """
    playlist = Playlist()
    # args is a dict of album titles (the key is an array index).
    albums = [request.args[index] for index in iter(request.args)]
    album_tracks = playlist.get_tracks_for_albums(albums)
    return jsonify({"tracks": album_tracks})


@app.route(url_with_prefix("/cpl/tracks"), methods=['GET'])
def search_for_tracks():
    """
    Search for tracks.
    :return:
    """
    playlist = Playlist()
    if len(request.args) > 0:
        if "track" in request.args:
            # Query for tracks
            tracks = playlist.search_for_tracks(request.args["track"])
    else:
        tracks = []

    return jsonify({"tracks": tracks})


@app.route(url_with_prefix("/cpl/namedplaylists"), methods=['POST'])
def save_named_playlist():
    """
    Save the current playlist as a named playlist
    (add current playlist to the collection of named playlists).
    The request data contains the name for the new named playlist.
    :return:
    """
    playlist = Playlist()
    # args is the name for the saved playlist
    args = json.loads(request.data.decode("utf-8"))
    playlist.save_current_playlist(args["data"]["name"])
    return ""
