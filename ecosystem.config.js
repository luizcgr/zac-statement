module.exports = {
  apps: [
    {
      name: 'zac-statement',
      script: './dist/zac-statement/server/server.mjs',
      instances: '5',
      exec_mode: 'cluster',
      env: {
        PM2: 'true',
        NODE_ENV: 'production',
        PORT: 4000,
        TZ: 'America/Sao_Paulo',
      }
    }
  ]
};
