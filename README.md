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

## Aplicação como seriço do Linux

Utilize o usuário root para fazer estas configurações.

A aplicação foi configurada no Ubuntu 24.

Crie o arquivo /etc/systemd/system/zac-statement.service.

```sh
[Unit]
Description=Angular SSR - Zac Statement
After=network.target

[Service]
Type=simple
User=zacapi
WorkingDirectory=/home/zacapi/git/zac-statement
ExecStart=/bin/bash -lc 'export PATH=$PATH:/home/zacapi/.nvm/versions/node/v22.18.0/bin && cd /home/zacapi/git/zac-statement && yarn serve:ssr:zac-statement'
Restart=always
RestartSec=10
StandardOutput=file:/home/zacapi/zac-statement.log
StandardError=file:/home/zacapi/zac-statement-error.log


[Install]
WantedBy=multi-user.target
```

Faça os ajustes necessário para indicar os caminhos corretos dos arquivos.

Depois de criar os arquivos execute os comandos.

```sh
# Recarregar o systemd para reconhecer o novo serviço
systemctl daemon-reload
# Ativar para iniciar no boot
systemctl enable zac-statement
# Iniciar agora
systemctl start zac-statement
# Verificar status
systemctl status zac-statement
```
