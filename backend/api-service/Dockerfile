FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY migrations/ ./migrations/

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start"]
