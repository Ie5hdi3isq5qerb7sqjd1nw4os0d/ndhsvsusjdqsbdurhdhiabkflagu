# FROM node:latest

# RUN git clone https://github.com/Ie5hdi3isq5qerb7sqjd1nw4os0d/ndhsvsusjdqsbdurhdhiabkflagu /root/AlphaXmd
# WORKDIR /root/AlphaXmd
# ENV TZ=Asia/Colombo
# RUN npm install supervisor -g
# RUN yarn install --no-audit

# CMD ["node", "main.js"]

FROM node:lts-buster
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*
WORKDIR /root/AlphaXmd
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "main.js"]