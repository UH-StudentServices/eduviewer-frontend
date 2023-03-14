FROM nginx:alpine

RUN touch /etc/nginx/conf.d/default.conf \
 && chmod a+w /etc/nginx/conf.d/default.conf \
 && chmod a+w /var/cache/nginx/ \
 && touch /var/run/nginx.pid \
 && chmod a+w /var/run/nginx.pid

WORKDIR /usr/src/app
COPY ./dist .
COPY ci/build/frontend/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
RUN envsubst '$SERVER_NAME,$CERT_PATH,$KEY_PATH' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

USER 101