import { NextFunction, Request, Response, Router } from 'express';
import { environment } from '../environments/environment';
import { obterToken } from './auth';

export const cardapioRouter = Router();

cardapioRouter.get('/cardapio/:chave', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const chave = encodeURIComponent(req.params['chave']);
        const token = await obterToken();

        const resposta = await fetch(
            `${environment.apiUrl}/v1/cardapio/${chave}/publico`,
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
