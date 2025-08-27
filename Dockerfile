# ---------- Base ----------
FROM node:24-slim AS base
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ---------- Install deps (with dev for build) ----------
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ---------- Build (TS -> JS) ----------
FROM deps AS build
COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# compiled JS output lives in lib/
COPY --from=build /app/lib ./lib
