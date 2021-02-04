FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd napi_blog
RUN npm run build
RUN cd ../
RUN npm run build
EXPOSE 8000
CMD ["npm","run","start"]