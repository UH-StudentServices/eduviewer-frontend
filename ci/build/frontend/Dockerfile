FROM nginx:alpine

RUN touch /etc/nginx/conf.d/default.conf \
 && chmod a+w /etc/nginx/conf.d/default.conf \
 && chmod a+w /var/cache/nginx/ \
 && touch /var/run/nginx.pid \
 && chmod a+w /var/run/nginx.pid

WORKDIR /usr/src/app
COPY ./dist .
COPY ./default.conf /etc/nginx/conf.d/default.conf
