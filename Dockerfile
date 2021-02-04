FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd napi_blog && npm run build
RUN npm run build
EXPOSE 8000
CMD ["npm","run","start"]