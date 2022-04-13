# -*- coding: utf-8 -*-
#
# AgentMPDFRB
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

#
# App configuration
#
# The ahps_web.conf file holds the configuration data in JSON format.
# Currently, it looks like this:
#
#   {
#     "DatabasePath": "/path/to/database/file",
#     "Server": "hostname",
#     "Port": "9999"
#   }
#
# The JSON parser is quite finicky about strings being quoted as shown above.
#
# This class behaves like a singleton class. There is only one instance of the configuration.
# There is no need to create an instance of this class, as everything about it is static.
#

import os
import json
import logging

logger = logging.getLogger("app")


class Configuration():
    ActiveConfig = None
    AppPath = ""

    ######################################################################
    def __init__(self):
        Configuration.load_configuration()

    @classmethod
    def load_configuration(cls):
        """
        Load the configuration file
        :param app_path:
        :return:
        """

        # Try to open the conf file. If there isn't one, we give up.
        try:
            cfg_path = Configuration.get_configuration_file_path()
            logger.info("Opening configuration file {0}".format(cfg_path))
            cfg = open(cfg_path, 'r')
        except Exception as ex:
            logger.error("Unable to open {0}".format(cfg_path))
            logger.error(str(ex))
            return

        # Read the entire contents of the conf file
        cfg_json = cfg.read()
        cfg.close()
        #print cfg_json

        # Try to parse the conf file into a Python structure
        try:
            config = json.loads(cfg_json)
            # The interesting part of the configuration is in the "Configuration" section.
            cls.ActiveConfig = config
        except Exception as ex:
            logger.error("Unable to parse configuration file as JSON")
            logger.error(str(ex))
            return

        #print str(Configuration.ActiveConfig)
        return

    @classmethod
    def get_config_var(cls, var_name):
        try:
            return cls.ActiveConfig[var_name]
        except Exception as ex:
            logger.error("Unable to find configuration variable {0}".format(var_name))
            logger.error(str(ex))
        return None

    @classmethod
    def port(cls):
        return int(cls.get_config_var("Port"))

    @classmethod
    def log_console(cls):
        return cls.get_config_var("LogConsole").lower() == "true"

    @classmethod
    def log_file(cls):
        return cls.get_config_var("LogFile")

    @classmethod
    def log_level(cls):
        return cls.get_config_var("LogLevel")

    @classmethod
    def secret_key(cls):
        return cls.get_config_var("SecretKey")

    @classmethod
    def get_configuration_file_path(cls):
        """
        Returns the full path to the configuration file
        """
        file_name = 'agentmpdfrb.conf'
        return file_name
