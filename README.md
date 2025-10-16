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

Altere a configuração /etc/nginx/nginx.conf para criar uma nova área de memória. Inclua o conteúdo antes do primeiro include.

```sh
limit_req_zone $binary_remote_addr zone=extrato_limit:10m rate=100r/m;
```

```sh
server {
        server_name extrato.zac.app.br;    # dns apontando para o ip do servidor.

        # --- Cabeçalhos de segurança (OWASP) ---
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

        # --- Proteção contra bots e força bruta ---
        limit_req zone=extrato_limit burst=10 nodelay;

        # --- Timeout e limites ---
        client_max_body_size 10M;
        client_body_timeout 10s;
        proxy_connect_timeout 5s;
        keepalive_timeout 15s;

        location / {
                proxy_pass http://localhost:4000/;  # upstream.
                proxy_connect_timeout 5s;    # tempo máximo para tentar conectar antes de retornar um erro
        }

        # --- Bloqueia scanners e crawlers agressivos ---
        if ($http_user_agent ~* (sqlmap|nikto|fimap|dirbuster|nmap|nessus|wpscan|curl|wget)) {
                return 403;
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
