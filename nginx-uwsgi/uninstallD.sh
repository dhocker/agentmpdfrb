#!/bin/bash

### Uninstall (remove) agentmpdfrb from uWSGI and nginx

# Uninstall steps

# nginx
sudo rm /etc/nginx/sites-enabled/agentmpdfrb_nginx_site
sudo rm /etc/nginx/sites-available/agentmpdfrb_nginx_site

# uWSGI
sudo rm /etc/uwsgi/vassals/uwsgi_agentmpdfrb.ini
sudo rm /etc/uwsgi/vassals-available/uwsgi_agentmpdfrb.ini

# restart services to effect the uninstall
sudo service restart uwsgi-emperor
sudo service restart nginx

exit 0

