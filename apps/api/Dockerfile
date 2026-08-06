# Production image for the NestJS backend (apps/api).
# Prisma 7 driver adapters (@prisma/adapter-pg) run queries through `pg`
# directly — no Rust query engine binary needed at runtime, so this image
# stays plain node:slim with no extra native deps.

FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3333

CMD ["node", "dist/src/main.js"]
