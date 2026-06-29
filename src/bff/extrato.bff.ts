import { NextFunction, Request, Response, Router } from 'express';
import { environment } from '../environments/environment';
import { obterToken } from './auth';

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
            const ip = req.headers['x-forwarded-for'] ?? req.ip;
            console.error(`[ERRO] Status ${resposta.status} ao chamar API | URL: ${req.url} | IP: ${ip}`);
            res.status(resposta.status).end();
            return;
        }

        res.json(await resposta.json());
    })().catch((err: Error) => {
        const ip = req.headers['x-forwarded-for'] ?? req.ip;
        console.error(`[ERRO] ${err.message} | URL: ${req.url} | IP: ${ip}`);
        next(err);
    });
});
