# Build stage
FROM node:16 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --output-path=./dist

# Production stage
FROM nginx:alpine
#COPY --from=build /app/dist/dashboard /usr/share/nginx/html
COPY dist/dashboard /usr/share/nginx/html
EXPOSE 80
# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
