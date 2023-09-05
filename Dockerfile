FROM nginx:latest
COPY ./src/ /usr/share/nginx/html/
COPY ./config/config.js /usr/share/nginx/html/js/config.js