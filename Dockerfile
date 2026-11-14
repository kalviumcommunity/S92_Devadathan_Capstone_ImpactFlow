FROM node:22-alpine AS api

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./

EXPOSE 5000

CMD ["npm", "start"]

FROM node:22-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
ARG VITE_API_URL="/"
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:1.27-alpine AS frontend

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=client-build /app/client/dist /usr/share/nginx/html

EXPOSE 80
