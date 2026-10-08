# Royal Guest Garden — site public (fichiers statiques servis par nginx)
#
#   docker compose up -d --build      → http://localhost:3003
#
# Seuls les fichiers du site sont copiés (voir .dockerignore) : pas de
# supabase/, tools/, .git, README…
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf

COPY *.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY img/ /usr/share/nginx/html/img/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
