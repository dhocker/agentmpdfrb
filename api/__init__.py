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

import atexit
from app_logging import enable_server_logging, shutdown
import logging
from api.views.url_utils import url_with_prefix
from configuration import Configuration

# Start up logging BEFORE running the server
cfg = Configuration()
enable_server_logging()

# In order for url prefixing to work, the path to static
# must be prefixed just like any other url.
from flask import Flask
app = Flask(__name__,
            static_url_path=url_with_prefix('/static'),
            static_folder='../build/static',
            template_folder='../build'
            )

# Load default config and override config from an environment variable
# This is really the Flask configuration
# app.config.update(dict(
#     DATABASE='ahps_web.sqlite3',
#     DEBUG=True,
#     SECRET_KEY='development key',
#     USERNAME='admin',
#     PASSWORD='default',
#     SQLALCHEMY_DATABASE_URI='',  # Use Sqlite file db
#     CSRF_ENABLED=True,
#     USER_ENABLE_EMAIL=False                   # Disable emails for now
# ))

# TODO Load randomly generated secret key from file
# Reference: http://flask.pocoo.org/snippets/104/
# Run make_secret_key to create a new key and save it in secret_key
# key_file = configuration.Configuration.SecretKey()
# app.config['SECRET_KEY'] = open(key_file, 'r').read()

# All views must be imported after the app is defined
from api.views import views
from api.views import settings
from api.views import playlist


def on_app_exit():
    """
    Catch server exist. Shutdown logging.
    :return:
    """
    logger = logging.getLogger("app")

    # Required to expose version
    # from version import GetVersion
    logger.info("################################################################################")
    logger.info("AgentMPDFRB ended")
    shutdown()


atexit.register(on_app_exit)
