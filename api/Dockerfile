FROM node:22.14.0-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm run build

FROM node:22.14.0-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

RUN pnpm rebuild bcrypt

EXPOSE 3000

CMD ["node", "dist/main"]
