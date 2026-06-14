import { NextFunction, Request, Response, Router } from 'express';
import { environment } from '../environments/environment';

interface TokenCache {
    value: string;
    expiresAt: number;
}

let _tokenCache: TokenCache | null = null;

async function obterToken(): Promise<string> {
    const agora = Date.now();
    if (_tokenCache && _tokenCache.expiresAt > agora + 30_000) {
        return _tokenCache.value;
    }

    const resposta = await fetch(`${environment.apiUrl}/v1/login/credenciais`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-app-origin': 'extrato',
        },
        body: JSON.stringify({ email: environment.user, senha: environment.pass }),
    });

    if (!resposta.ok) {
        throw new Error(`Falha ao autenticar: ${resposta.status}`);
    }

    const dados = await resposta.json() as { accessToken: string; expiration: string };
    _tokenCache = {
        value: dados.accessToken,
        expiresAt: new Date(dados.expiration).getTime(),
    };

    return _tokenCache.value;
}

export const extratoRouter = Router();

extratoRouter.get('/cartoes/:codigo/extrato', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const codigo = encodeURIComponent(req.params['codigo']);
        const token = await obterToken();

        const resposta = await fetch(
            `${environment.apiUrl}/v1/cartoes/${codigo}/extrato-publico`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-app-origin': 'extrato',
                },
            },
        );

        if (resposta.status === 404) {
            res.status(404).end();
            return;
        }

        if (!resposta.ok) {
            res.status(resposta.status).end();
            return;
        }

        res.json(await resposta.json());
    })().catch(next);
});
