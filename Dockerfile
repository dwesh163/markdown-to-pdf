FROM node:22-alpine AS base

# Install dependencies for Firefox and Xvfb
RUN apk add --no-cache libc6-compat firefox nss freetype harfbuzz ca-certificates ttf-freefont xorg-server xvfb
WORKDIR /app

# Install build tools and dependencies
RUN apk add --no-cache build-base python3 && rm -rf /var/cache/apk/*
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; fi

FROM base AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

RUN if [ -f yarn.lock ]; then yarn run build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; fi

# Install Puppeteer and Firefox dependencies
RUN npm install puppeteer@latest @puppeteer/firefox --save

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PUPPETEER_PRODUCT=firefox
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/firefox

# Start Xvfb to create a virtual display
CMD ["xvfb-run", "--server-args=-screen 0 1280x1024x24", "node", "server.js"]

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
