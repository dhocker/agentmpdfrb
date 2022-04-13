#
# AgentMPDFRB - logging setup
# Copyright © 2022  Dave Hocker (email: AtHomeX10@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# See the LICENSE file for more details.
#

import logging
import logging.handlers
import configuration


def enable_server_logging():
    """
    Enable logging for the AtHomePowerlineServer application
    :return: None
    """
    # Default overrides
    log_format = '%(asctime)s, %(module)s, %(levelname)s, %(message)s'
    log_date_format = '%Y-%m-%d %H:%M:%S'

    # Logging level override
    log_level_override = configuration.Configuration.log_level().lower()
    if log_level_override == "debug":
        log_level = logging.DEBUG
    elif log_level_override == "info":
        log_level = logging.INFO
    elif log_level_override == "warn":
        log_level = logging.WARNING
    elif log_level_override == "error":
        log_level = logging.ERROR
    else:
        log_level = logging.DEBUG

    logger = logging.getLogger()
    logger.setLevel(log_level)

    formatter = logging.Formatter(log_format, datefmt=log_date_format)

    # Do we log to console?
    if configuration.Configuration.log_console():
        ch = logging.StreamHandler()
        ch.setLevel(log_level)
        ch.setFormatter(formatter)
        root_logger = logging.getLogger()
        root_logger.addHandler(ch)

    # Do we log to a file?
    log_file = configuration.Configuration.log_file()
    if log_file != "":
        # To file
        fh = logging.handlers.TimedRotatingFileHandler(log_file, when='midnight', backupCount=3)
        fh.setLevel(log_level)
        fh.setFormatter(formatter)
        root_logger = logging.getLogger()
        root_logger.addHandler(fh)
        logger.debug("Logging to file: %s", log_file)

    if configuration.Configuration.log_console():
        logger.debug("Logging to console")

    # WerkZeug logging (turn it off)
    # After considerable research, this was found to stop WerkZeug
    # from logging redundant records to the console (stderr).
    fh = logging.FileHandler("/dev/null", "w")
    fh.setLevel(log_level)
    w_logger = logging.getLogger("werkzeug")
    for handler in w_logger.handlers:
        w_logger.removeHandler(handler)
    w_logger.addHandler(fh)


def shutdown():
    """
    Controlled logging shutdown
    :return: None
    """
    logger = logging.getLogger()
    logger.info("Logging shutdown")
    logging.shutdown()
