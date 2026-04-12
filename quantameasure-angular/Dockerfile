# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

COPY . .

# Replace the API URL placeholder with the actual backend URL from env
ARG BACKEND_URL=http://localhost:8080
ENV BACKEND_URL=${BACKEND_URL}
RUN node replace-env.js && npm run build

# ── Stage 2: Serve with nginx ─────────────────────────────────────────────────
FROM nginx:alpine AS final

# Copy built Angular app
COPY --from=build /app/dist/quantameasure/browser /usr/share/nginx/html

# nginx config for Angular SPA (handles client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
