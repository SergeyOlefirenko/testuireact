FROM node:18-alpine

WORKDIR /app

EXPOSE 3000

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD ["npm", "start"]

# # Используем официальный образ Node.js
# FROM node:14
# # Устанавливаем рабочую директорию внутри контейнера
# WORKDIR /usr/src/app
# # Копируем package.json и package-lock.json внутрь контейнера
# COPY package*.json ./
# # Устанавливаем зависимости
# RUN npm install
# # Копируем все файлы из текущего каталога (где находится Dockerfile) в рабочую директорию контейнера
# COPY . .
# # Собираем приложение
# RUN npm run build
# # Определение команды для запуска приложения
# CMD ["npm", "start"]
