<h1 align="center">
TODO APP
</h1>


### Requisitos

* Docker instalado
* Docker compose instalado
* Nodejs
* NPM

# Rodando aplicação completa

## Rodando backend

  Na pasta api  do projeto digite o comando:

  ```sh
  docker compose up -d --build
  ```

  Depois rode o comando abaixo para criar as tabelas no banco de dados:

  ```sh
  docker compose run --rm app npm run migration:run

  ```

## Rodando frontend

  Na pasta frontend do projeto digite o comando baixo para instalar as dependencias:

  ```sh
 npm install --legacy-peer-deps
  ```

  Depois rode esse comando para inicar a aplicação

  ```sh
 npm run dev
  ```

# Portas da Aplicação

* api: **3001**
* frontend: **3000**

## Para acessar a documentação da api

```sh
 http://localhost:3001/api
```
