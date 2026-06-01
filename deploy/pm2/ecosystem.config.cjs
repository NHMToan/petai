module.exports = {
  apps: [
    {
      name: "petai-api",
      cwd: "/var/www/petai/api",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "500M",
      error_file: "/var/www/petai/api/logs/error.log",
      out_file: "/var/www/petai/api/logs/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
