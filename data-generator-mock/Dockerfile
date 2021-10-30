FROM node:16.12.0-alpine
EXPOSE 3211
WORKDIR /app/
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "index.js"]
