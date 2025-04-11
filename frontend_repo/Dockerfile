# 1. Node 기반으로 빌드
FROM node:22.2.0 AS build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# 2. 빌드 결과만 추출할 용도
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
