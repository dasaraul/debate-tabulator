module.exports = {
  apps: [{
    name: 'debate-tabulator',
    script: 'server.js',
    cwd: '/var/www/debate-tabulator',
    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode: 'fork',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
