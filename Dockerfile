FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

COPY .env .env.development ./

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
