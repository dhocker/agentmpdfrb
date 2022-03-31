# AgentMPDFRB
Copyright © 2022 by Dave Hocker

## Overview

AgentMPDFRB is a rewrite of the AgentMPD app. Like AgentMPD, it 
is a web server based client app for the [mpd](http://www.musicpd.org) music server.
It will also work with the [Mopidy](https://www.mopidy.com/) music server.
It will allow you to control one running instance of mpd from any web browser (it has been tested
with Chrome, Firefox, Firefox Developer Edition and Brave).

AgentMPDFRB was written using Python/Flask/React/Javascript. It is light weight and the server side 
app will run on a Raspberry Pi. The server app uses on Python 3 (e.g. 3.9.x).
The mpd music server can be running
anywhere as long as you can get to it via a TCP/IP connection.

AgentMPDFRB is open source. Anyone can fork it and build upon it.

## License

The AgentMPDFRB app is licensed under the GNU General Public License v3 as published by the Free Software Foundation, Inc.. See the
LICENSE file for the full text of the license.

## Source Code

The full source is maintained on [GitHub](https://www.github.com/dhocker/agentmpdfrb).

## Build Environment
### Server Side

The AgendtMPDFRB server uses the popular Flask server framework.

A suitable development environment would use virtualenv and virtualenvwrapper to create a working virtual environment.
The requirements.txt file can be used with pip to create the required virtual environment with all dependencies.

The following steps should provide a working installation.

1. Clone the source repository from GitHub into a project directory of your choice.
1. Create a virtual environment using virtualenv and virtualenvwrapper.

   * To create: mkvirtualenv -r requirements.txt agentmpdfrb3
   * To activate: workon agentmpdfrb3
   * You can use the -a option of mkvirtualenv to automatically switch to the correct venv when you enter the 
project directory.

1. You can run the web server from the project directory using: python runserver.py
1. If you use PyCharm as your IDE you can set up a test configuration that starts runserver.py.
2. Note that the server defaults to port 5000.

AgentMPDFRB was developed using [PyCharm Professional](https://www.jetbrains.com/pycharm/) 
(the community version will work, too). PyCharm is highly recommended. However, a good text editor
of your choice is all that is really required.

### Web Browser Side

The web browser app started life via [create-react-app](https://create-react-app.dev/). As such it is
based on Javascript and React.

Initially, you need to install the required npm/node modules. Steps to building the browser app.

1. Install node modules by running npm install.
2. Build the app by running npm run build-d. This builds a debug version of the code. If you
want to watch the source folder use npm run watch.
3. Using a browser (e.g Firefox Developer), go to localhost:5000.
4. Go to the settings page and fill in the information for your mpd system.

## Configuration

All configuration is done through the Settings page of the browser app. The only setting that usually requires change is the
hostname or IP address of the mpd music server. You can get to the settings page by going to the home page
(e.g. http://localhost:5000) and clicking on the Settings menu item.

## Running as an Application

You can run AgentMPDFRB as an application as follows.

1. If you are using virtualenv, activate the environment you set up: workon mpd_web_client
2. Then: python runserver.py

This is fine for debugging and personal use, but for "production" use you need to run it
under a web server.

## Running Under a Web Server

AgentMPDFRB can be run under a web server (e.g. nginx) using the uWSGI gateway. How to do this is
beyond the scope of this document.

The following links discuss the details of setting up nginx and uWSGI to run a Python/Flask web application.

* [serving-flask-with-nginx-on-ubuntu](http://vladikk.com/2013/09/12/serving-flask-with-nginx-on-ubuntu/)
* [how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-14-04)
