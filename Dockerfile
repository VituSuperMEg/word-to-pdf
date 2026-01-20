FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Dependências básicas
RUN apt update && apt install -y \
  libreoffice \
  libreoffice-writer \
  fonts-dejavu \
  locales \
  && locale-gen en_US.UTF-8 \
  && apt clean

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
