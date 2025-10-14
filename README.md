# ZacStatement

Projeto para consulta de extratos pelos próprios clientes.

# Configuração do serviço no servidor.

## Configuração do DNS

Aponte o dns extrato.zac.app.br para o endereço onde o serviço será executado.

## Configuração do certificado

Crie o arquivo /etc/nginx/sites-available/extrato.zac.app.br.

```shell
server {
	server_name extrato.zac.app.br;       # dns apontando para o ip do servidor.

	location / {
		proxy_pass http://localhost:4000/;  # upstream.
		proxy_connect_timeout 5s;           # tempo máximo para tentar conectar antes de retornar um erro
	}
}
```

Crie um link simbólico no diretŕio /etc/nginx/sites-enabled.

Crie o certificado.

```sh
certbot --nginx -d extrato.zac.app.br
```

Caso o app não consiga finalizar toda a configuração, ajuste o arquivo para ficar da seguinte maneira.

```sh
server {
	server_name extrato.zac.app.br;    # dns apontando para o ip do servidor.

	location / {
		proxy_pass http://localhost:4000/;  # upstream.
		proxy_connect_timeout 5s;    # tempo máximo para tentar conectar antes de retornar um erro
	}

	listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/extrato.zac.app.br/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/extrato.zac.app.br/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = extrato.zac.app.br) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    server_name extrato.zac.app.br;
    listen 80;
    return 404; # managed by Certbot
}
```

## Iniciar com pm2

Dentro do diretório da aplicação, execute o comando a seguir.

```sh
pm2 start
```

```sh
pm2 save
```

Caso a aplicação zacapi ainda não esteja configuração, execute o comando para forçar o reinício da aplicação quando a máquina for restartada. Caso contrário não é necessário configurar o startup.

```sh
pm2 startup
```

A documentação a seguir foi utilizada para ajustar a aplicação para rodar em conjunto com o pm2.

[https://github.com/Unitech/pm2/issues/5921](https://github.com/Unitech/pm2/issues/5921)
