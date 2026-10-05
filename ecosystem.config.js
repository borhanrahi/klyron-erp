module.exports = {
  apps: [
    {
      name: "klyron-api",
      cwd: "./backend",
      script: ".venv/bin/python",
      args: "-m uvicorn app.main:app --host 127.0.0.1 --port 8000",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
    {
      name: "klyron-web",
      cwd: "./frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
