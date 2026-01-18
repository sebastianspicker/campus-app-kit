FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g tsx
EXPOSE 4000
CMD ["tsx", "src/server.ts"]
