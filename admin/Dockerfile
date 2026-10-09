# Royal Guest Garden — back-office (React + Vite), servi par nginx.
#
#   docker compose up -d --build admin      → http://localhost:3004
#
# Les VITE_* sont publiques (incluses dans le code envoyé au navigateur).
# Valeurs par défaut = développement local ; en production, passez
# --build-arg VITE_SUPABASE_URL=… etc. NE JAMAIS y mettre la clé service_role.

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_SUPABASE_URL=http://127.0.0.1:54321
ARG VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
ARG VITE_SITE_URL=http://localhost:3003
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_SITE_URL=$VITE_SITE_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
