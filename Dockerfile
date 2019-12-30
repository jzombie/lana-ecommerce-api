FROM node:10

WORKDIR /app

COPY . .

RUN npm install

USER node

CMD ["npm", "run", "start"]