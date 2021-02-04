FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN sudo apt-get install --only-upgrade libstdc++6
RUN npm run build
EXPOSE 8000
CMD ["npm","run","start"]