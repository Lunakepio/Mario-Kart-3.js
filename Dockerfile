FROM node:20-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]