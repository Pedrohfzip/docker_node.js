# Docker — Node App
 
## Comandos
 
**Build**
```bash
docker build -t node-app .
```
Cria a imagem a partir do Dockerfile. `-t` define o nome da imagem.
 
---
 
**Criar e rodar container**
```bash
docker run -v ${PWD}:/app:ro -v /app/node_modules --env-file ./.env -p 3000:3000 -d --name node-app-container node-app
```
| Flag | O que faz |
|------|-----------|
| `-v ${PWD}:/app:ro` | Sincroniza a pasta local com `/app` em modo **read-only** — o container não pode alterar arquivos do host |
| `-v /app/node_modules` | Preserva o `node_modules` da imagem, evitando ser sobrescrito |
| `--env-file ./.env` | Carrega variáveis de ambiente do arquivo `.env` para dentro do container |
| `-p 3000:3000` | Mapeia a porta do container para a máquina (`host:container`) |
| `-d` | Roda em segundo plano |
| `--name` | Nomeia o container para uso nos demais comandos |
 
---
 
**Acessar o container**
```bash
docker exec -it node-app-container bash
```
Abre um terminal interativo dentro do container. Use `sh` em imagens sem bash.
 
---
 
**Deletar container**
```bash
docker rm node-app-container -f
```
Remove o container. `-f` força a remoção mesmo se estiver rodando.
 
---
 
**Ver logs**
```bash
docker logs node-app-container
# Tempo real:
docker logs -f node-app-container
```
 
---
 
## Dockerfile
 
```dockerfile
FROM node:22          # imagem base oficial do Node 22
WORKDIR /app          # diretório de trabalho dentro do container
COPY package.json ./  # copiado antes do restante para aproveitar cache
RUN npm install       # instala dependências (camada cacheada)
COPY . ./             # copia o projeto (respeita .dockerignore)
EXPOSE 3000           # declarativo — a porta é publicada pelo -p no docker run
CMD ["npm", "run", "start"]  # inicia o app (nodemon via script start)
```
 
---
 
## Docker Compose
 
Todos os comandos manuais acima podem ser substituídos pelo `docker-compose.yml`. Em vez de rodar `docker build` + `docker run` com todas as flags, basta um único comando:
 
```bash
docker-compose up
# Em segundo plano:
docker-compose up -d
# Parar e remover os containers:
docker-compose down
```
 
O `docker-compose.yml` já define build, portas, volumes e variáveis de ambiente:
 
```yaml
version: "5"
services:
  node-app-container:
    build: .               # equivalente ao docker build -t node-app .
    ports:
      - "3000:3000"        # equivalente ao -p 3000:3000
    volumes:
      - .:/app             # equivalente ao -v ${PWD}:/app
      - /app/node_modules  # equivalente ao -v /app/node_modules
    env_file:
      - ./.env             # equivalente ao --env-file ./.env
```
