module.exports = {
  apps: [
    // {
    //   script: 'index.js',
    //   watch: '.',
    // },
    // {
    //   script: './service-worker/',
    //   watch: ['./service-worker'],
    // },
    {
      script: 'pnpm start',
    },
  ],

  // this is not ready yet

  deploy: {
    production: {
      // default
      // user: 'SSH_USERNAME',
      // host: 'SSH_HOSTMACHINE',
      // ref: 'origin/master',
      // repo: 'GIT_REPOSITORY',
      // path: 'DESTINATION_PATH',
      // 'pre-deploy-local': '',
      // 'post-deploy':
      //   'npm install && pm2 reload ecosystem.config.js --env production',
      // 'pre-setup': '',
      // ----------------
      // https://www.fullstackbook.com/guides/how-to-deploy-nextjs-with-pm2/
      // key: 'key.pem',
      user: 'ubuntu',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/main',
      repo: 'GIT_REPOSITORY',
      path: '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy':
        'source ~/.nvm/nvm.sh && pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      // ssh_options: 'ForwardAgent=yes',
    },
  },
};
