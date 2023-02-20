# Setup GCP VM

## Setup deployment on VM

https://www.fullstackbook.com/guides/how-to-deploy-nextjs-with-pm2/

> If a dialog pops up titled "Daemons using outdated libraries", press <kbd>Enter</kbd>

```bash
sudo apt-get update && sudo apt-get -y upgrade

# Clone project repo (will need to generate personal access token - https://github.com/settings/tokens - use it as your password)
cd ~
git clone https://github.com/lborocs/22cob290-part2-team-10.git

cd ~/22cob290-part2-team-10/prototype_nextjs
. bin/setup.sh
. bin/run.sh

pnpm start
```

## Open in browser
http://34.142.66.186/
