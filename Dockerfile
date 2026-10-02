FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src/ src/
ARG VITE_POCKETBASE_URL=http://localhost:8090
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
RUN npm run build
# User documentation (VitePress), served at /docs — see nginx.conf.
COPY docs/ docs/
RUN npm run docs:build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html/docs
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
