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
from api import app
from api.views.views import reset_player
from api.models.settings import Settings
from api.views.url_utils import url_with_prefix
from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, jsonify
import json
from http import HTTPStatus
import logging

logger = logging.getLogger("app")


@app.route(url_with_prefix("/settings"), methods=['GET'])
def get_settings():
    # Return current settings
    logger.debug("Returning all settings")
    return jsonify(Settings.get())


@app.route(url_with_prefix("/settings"), methods=['PUT'])
def save_settings():
    # Save settings
    args = json.loads(request.data.decode())["data"]
    Settings.save(args)
    reset_player()
    logger.debug(json.dumps(args, indent=4))
    logger.debug("All settings saved")
    return "", HTTPStatus.OK
