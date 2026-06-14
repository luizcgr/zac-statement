import { environment } from '../environments/environment';

interface TokenCache {
    value: string;
    expiresAt: number;
}

let _tokenCache: TokenCache | null = null;

export async function obterToken(): Promise<string> {
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
