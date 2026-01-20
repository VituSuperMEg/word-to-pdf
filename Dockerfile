FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Dependências básicas
RUN apt update && apt install -y \
  libreoffice \
  libreoffice-writer \
  fonts-dejavu \
  nodejs \
  npm \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
