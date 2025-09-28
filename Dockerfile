# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
RUN npm install

COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/client ./client
COPY package.json ./
COPY server.js ./

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
