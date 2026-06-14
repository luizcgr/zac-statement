import { environment } from '../environments/environment';

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    validity: string;
    expiration: string;
}

interface TokenCache {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt: number;
}

let _tokenCache: TokenCache | null = null;

function armazenarCache(dados: TokenResponse): void {
    _tokenCache = {
        accessToken: dados.accessToken,
        refreshToken: dados.refreshToken,
        accessTokenExpiresAt: new Date(dados.validity).getTime(),
        refreshTokenExpiresAt: new Date(dados.expiration).getTime(),
    };
}

async function login(): Promise<void> {
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

    armazenarCache(await resposta.json() as TokenResponse);
}

async function refreshToken(cache: TokenCache): Promise<boolean> {
    const resposta = await fetch(`${environment.apiUrl}/v1/login/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-app-origin': 'extrato',
        },
        body: JSON.stringify({ accessToken: cache.accessToken, refreshToken: cache.refreshToken }),
    });

    if (!resposta.ok) {
        return false;
    }

    armazenarCache(await resposta.json() as TokenResponse);
    return true;
}

export async function obterToken(): Promise<string> {
    const agora = Date.now();

    if (_tokenCache && _tokenCache.accessTokenExpiresAt > agora + 30_000) {
        return _tokenCache.accessToken;
    }

    if (_tokenCache && _tokenCache.refreshTokenExpiresAt > agora) {
        const atualizado = await refreshToken(_tokenCache);
        if (atualizado) {
            return _tokenCache!.accessToken;
        }
    }

    await login();
    return _tokenCache!.accessToken;
}
