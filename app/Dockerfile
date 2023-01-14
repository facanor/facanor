FROM node:lts-bullseye

WORKDIR /app

# COPY package*.json ./
COPY package.json package-lock.json ./

# RUN npm install
RUN npm ci

# COPY . .
COPY . /app

EXPOSE 3000

CMD [ "npm", "start" ]
