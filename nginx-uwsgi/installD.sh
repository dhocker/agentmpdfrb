#!/bin/bash

### Install agentmpdfrb as a uWSGI vassal under nginx

# It is assumed that uWSGI is installed and set up as a service
# under the name uwsgi-emperor

# Installation steps

# nginx
sudo cp agentmpdfrb_nginx_site /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/agentmpdfrb_nginx_site /etc/nginx/sites-enabled/agentmpdfrb_nginx_site

# uWSGI
if [[ ! -e /etc/uwsgi/vassals-available ]]; then
  sudo mkdir /etc/uwsgi/vassals-available
fi
sudo cp uwsgi_agentmpdfrb.ini /etc/uwsgi/vassals-available
sudo ln -s /etc/uwsgi/vassals-available/uwsgi_agentmpdfrb.ini /etc/uwsgi/vassals/uwsgi_agentmpdfrb.ini

exit 0

