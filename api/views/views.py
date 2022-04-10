#
# AgentMPDFRB - web app for controlling an mpd instance
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


from api import app
from api.models.player import Player
from api.views.url_utils import url_with_prefix
from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, jsonify, send_from_directory
from version import get_release_version
import json
import os
from pathlib import Path
from http import HTTPStatus


# The path to the Webpack build folder.
# This is essentially a workaround to get to the favicon.ico and logo*.png files.
build_dir = os.path.join(app.root_path, '../build')


@app.route('/favicon.ico')
def favicon():
    """
    The stock webpack.config.js causes favicon.ico to be placed in the "build"
    folder, not the static folder. We would really, really like to use the stock
    webpack config file. So, this workaround serves up the favicon.ico that is in
    the build folder.
    :return:
    """
    return send_from_directory(build_dir, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/logo<reso>.png')
def logos(reso):
    """
    The stock webpack.config.js causes logos to be placed in the "build"
    folder, not the static folder. We would really, really like to use the stock
    webpack config file. So, this workaround serves up the logo(s) that is in
    the build folder.
    :return:
    """
    logo_file = f"logo{reso}.png"
    return send_from_directory(build_dir, logo_file)


@app.route(url_with_prefix("/about"), methods=['GET'])
@app.route(url_with_prefix("/player"), methods=['GET'])
@app.route(url_with_prefix("/editplaylist"), methods=['GET'])
@app.route(url_with_prefix("/settingsform"), methods=['GET'])
@app.route(url_with_prefix("/updatedatabase"), methods=['GET'])
@app.route(url_with_prefix("/"), methods=['GET'])
def mpd_player():
    """
    Show the MPD player page.
    :return:
    """
    return render_template('index.html')


@app.route(url_with_prefix("/player/currentstatus"), methods=['GET'])
def get_current_status():
    """
    Return the current player status.
    :return:
    """
    player = Player()
    try:
        current_status = player.get_current_player_status()
        if "pos" in current_status:
            current_status["pos1"] = int(current_status["pos"]) + 1
        else:
            current_status["pos1"] = ""
        return jsonify(**current_status)
    except Exception:
        pass
    return "MPD connection error", HTTPStatus.SERVICE_UNAVAILABLE


@app.route(url_with_prefix("/player/currentsong/<pos>"), methods=['PUT'])
def play_song(pos):
    """
    Make the current song be current playlist[pos].
    The value of pos can be first, previous, next, last or nnn (a number).
    :param pos:
    :return:
    """
    player = Player()
    try:
        n = int(pos)
        player.play(n)
    except:
        # The new song is not a position number (0-n)
        if pos == "first":
            play_first();
        elif pos == "previous":
            play_previous()
        elif pos == "next":
            play_next()
        elif pos == "last":
            play_last()

    current_status = player.get_current_player_status()
    return jsonify(**current_status)


@app.route(url_with_prefix("/player/nextsong/<id>"), methods=['PUT'])
def queue_song(id):
    """
    Queue a song to be played next. The id is the songid, not the song position.
    :param id:
    :return:
    """
    player = Player()
    try:
        n = int(id)
        player.queue(n)
    except:
        pass

    current_status = player.get_current_player_status()
    return jsonify(**current_status)


@app.route(url_with_prefix("/player/status"), methods=['PUT'])
def update_player_status():
    """
    Update the player status. New status keys can be
    playstatus - values can be toggle, play or stop.
    random - 0 or 1
    sonsume - 0 or 1
    repeat - 0 or 1
    single - 0 or 1
    :return:
    """
    player = Player()
    new_status_kv = request.get_json()['data']

    if "playstatus" in new_status_kv:
        new_status = new_status_kv["playstatus"]
        current_status = player.get_current_player_status()

        if new_status == "toggle":
            if current_status['state'] == 'play':
                player.pause(1)
            elif current_status['state'] == 'pause':
                player.pause(0)
            elif current_status['state'] == 'stop':
                # If there is a song in the current status, we'll start
                # playing it. Otherwise, we'll arbitrarily play the first song.
                if "song" in current_status:
                    player.play(current_status['song'])
                else:
                    player.play(0)
        elif new_status == "play":
            player.play(current_status['song'])
        elif new_status == "stop":
            player.stop()
    if "random" in new_status_kv:
        player.random(int(new_status_kv["random"]))
    if "consume" in new_status_kv:
        player.consume(int(new_status_kv["consume"]))
    if "single" in new_status_kv:
        player.single(int(new_status_kv["single"]))
    if "repeat" in new_status_kv:
        player.repeat(int(new_status_kv["repeat"]))

    current_status = player.get_current_player_status()
    return jsonify(**current_status)


def play_first():
    """
    Play the first song in the current playlist.
    :return:
    """
    player = Player()
    player.play(0)
    current_status = player.get_current_player_status()
    return jsonify(**current_status)

#
# Note on play previous and play last.
# The client.previous() and client.next() methods
# only work IF MPD is playing or paused. If MPD is
# stopped, neither method seems to work. As a result,
# we have chosen to implement the logical actions
# of play previous and play next so that they play
# the previous/next playlist entry regardless of the
# current state of MPD
#


def play_previous():
    """
    Play the previous song in the current playlist
    :return:
    """
    player = Player()
    current_status = player.status()
    playlist_len = int(current_status[u'playlistlength'])
    song = int(current_status[u'song']);
    if song > 0:
        player.play(song - 1)
    current_status = player.get_current_player_status()
    return jsonify(**current_status)


def play_next():
    """
    Play the next song in the current playlist
    :return:
    """
    player = Player()
    current_status = player.status()
    playlist_len = int(current_status[u'playlistlength'])
    song = int(current_status[u'song']);
    if (song + 1) < playlist_len:
        player.play(song + 1)
    current_status = player.get_current_player_status()
    return jsonify(**current_status)


def play_last():
    """
    Play the last song in the current playlist
    :return:
    """
    player = Player()
    current_status = player.status()
    player.play(int(current_status[u'playlistlength']) - 1)
    current_status = player.get_current_player_status()
    return jsonify(**current_status)


@app.route(url_with_prefix("/player/volumelevel/<volume>"), methods=['PUT'])
def volume_change(volume):
    """
    Change the current volume setting.
    :return:
    """
    player = Player()
    try:
        player.setvol(int(volume))
    except Exception as ex:
        pass

    current_status = player.get_current_player_status()
    return jsonify(**current_status)


@app.route(url_with_prefix("/player/songposition/<newtime>"), methods=['PUT'])
def song_time_change(newtime):
    """
    Change the current song position.
    :return:
    """
    player = Player()
    try:
        player.settime(int(newtime))
    except Exception as ex:
        pass

    current_status = player.get_current_player_status()
    return jsonify(**current_status)


@app.route(url_with_prefix("/player/musicdatabase"), methods=['PUT'])
def update_music_database():
    """
    Change the current volume setting by a +/- amount.
    :return:
    """
    player = Player()
    try:
        player.update_music_database()
    except:
        pass

    current_status = player.get_current_player_status()
    return jsonify(**current_status)


def reset_player():
    """
    Reset the player instance when settings are changed.
    :return:
    """
    pass


@app.route("/markdown/<fn>", methods=["GET"])
def get_markdown_file(fn):
    mdtext = ""
    static_folder = Path(os.getcwd())
    file_path = static_folder / (fn + ".md")
    print("get markdown file:", file_path)
    with open(file_path, "r") as mdfh:
        mdtext = mdfh.read()

    # We return JSON format just to be consistent
    resp = {"markdown": mdtext}
    return jsonify(resp)


@app.route("/mpdversion", methods=["GET"])
def get_mpd_version():
    return get_release_version()
