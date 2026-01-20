FROM node:18-bullseye

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y \
  libreoffice \
  libreoffice-writer \
  fonts-dejavu \
  locales \
  file \
  && locale-gen en_US.UTF-8 \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
