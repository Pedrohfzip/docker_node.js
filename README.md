Build

docker build -t node-app .
Lê o Dockerfile do diretório atual e cria uma imagem chamada node-app. A imagem é o "molde" — a partir dela você cria quantos containers quiser.

-t node-app
nomeia a imagem (tag). Sem isso o nome fica como um hash aleatório.
.
contexto de build — pasta onde o Docker vai procurar o Dockerfile e copiar os arquivos.
Criar e rodar container

docker run -v ${"{"}pwd{"}"}:/app -v /app/node_modules -p 3000:3000 -d --name node-app-container node-app
Cria e inicia um container a partir da imagem node-app, com hot-reload funcionando via volumes. Alterações no código local refletem imediatamente dentro do container.

-v ${"{"}pwd{"}"}:/app
sincroniza a pasta local (pwd = diretório atual) com /app dentro do container — qualquer mudança de arquivo aparece lá dentro em tempo real.
-v /app/node_modules
volume anônimo que protege o node_modules instalado na imagem — sem isso a sincronização acima sobrescreveria essa pasta com a versão local (que pode estar vazia).
-p 3000:3000
mapeia a porta 3000 do container para a porta 3000 da sua máquina. Formato: porta-host:porta-container.
-d
modo detached — roda em segundo plano, liberando o terminal.
--name
dá um nome ao container para referenciar nos outros comandos.
Acessar o container

docker exec -it node-app-container bash
Abre um terminal bash interativo dentro do container em execução. Você pode navegar pelos arquivos, rodar comandos, verificar variáveis de ambiente, etc.

exec
executa um comando dentro de um container que já está rodando.
-it
-i mantém o stdin aberto, -t aloca um pseudo-terminal — juntos tornam a sessão interativa (como um SSH).
bash
o comando a executar dentro do container. Pode ser sh em imagens mais enxutas que não têm bash.
Deletar container

docker rm node-app-container -f
Remove o container. Normalmente é preciso parar antes de remover — o -f faz os dois de uma vez.

-f
force — força a remoção mesmo se o container estiver rodando (para e deleta em um passo).
Ver logs

docker logs node-app-container
Exibe tudo que o container imprimiu no stdout/stderr desde que foi iniciado — útil para ver erros da aplicação sem precisar entrar no container.

-f
dica: adicione -f para seguir os logs em tempo real (igual tail -f).
Dockerfile — linha a linha

FROM node:22
imagem base — parte de uma imagem oficial do Node 22 (Debian por baixo). Tudo que vem depois é construído em cima dela.
WORKDIR /app
define /app como diretório de trabalho dentro do container. Todos os COPY, RUN e CMD seguintes operam a partir daqui.
COPY package.json ./
copia só o package.json primeiro para aproveitar o cache do Docker — se as dependências não mudaram, a próxima camada não é rebuildada.
RUN npm install
instala as dependências dentro da imagem. Isso vira uma camada cacheada — só roda de novo se o package.json mudar.
COPY . ./
copia o restante do projeto (arquivos listados no .dockerignore são ignorados). Separar do npm install preserva o cache das dependências.
EXPOSE 3000
documenta que o container usa a porta 3000. É só declarativo — não publica a porta; isso é feito pelo -p no docker run.
CMD ["npm", "run", "start"]
comando padrão ao iniciar o container. Roda o script start do package.json (que chama nodemon). Pode ser sobrescrito no docker run.
