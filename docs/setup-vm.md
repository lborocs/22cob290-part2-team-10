# Setup GCP VM

## Setup deployment on VM

https://www.fullstackbook.com/guides/how-to-deploy-nextjs-with-pm2/

> If a dialog pops up titled "Daemons using outdated libraries", press <kbd>Enter</kbd>

```bash
sudo apt-get update && sudo apt-get -y upgrade

# Install nginx
sudo apt-get install -y nginx

# Install npm
# https://github.com/nodesource/distributions#using-ubuntu
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# Install pnpm globally using npm
sudo npm i -g pnpm

# Stuff to do with PM2
... (idk yet)

# Clone project repo (will need to generate personal access token - https://github.com/settings/tokens - use it as your password)
cd ~
git clone https://github.com/lborocs/22cob290-part2-team-10.git

# Enter part 2 of project
cd 22cob290-part2-team-10/prototype_nextjs

####### before this branch is merged with main
git switch nginx-pm2

# not sure if it will be needed after merge
pnpm i &&\
pnpm prisma generate
#######

# Use MySQL prisma schema & migrations
mv prisma/sqlite.prisma prisma/schema.prisma
rm -r prisma/migrations
mv prisma/mysql_migrations prisma/migrations

# Copy nginx config from project into VM
sudo cp nginx/app.conf /etc/nginx/conf.d/app.conf

# Restart nginx
sudo service nginx restart

# Maybe more stuff to do with PM2

# Install docker
# https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
sudo apt-get update &&\
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release &&\
sudo mkdir -m 0755 -p /etc/apt/keyrings &&\
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg &&\
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null &&\
sudo apt-get update &&\
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start prop docker (app & database)
sudo docker compose -p t10gp-prod -f docker-compose.prod.yaml --env-file .env.docker up
# Maybe only use docker compose for mysql?

```

## Open in browser
http://34.142.66.186/
