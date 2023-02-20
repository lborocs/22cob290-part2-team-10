# /bin/bash

# Enter part 2 of project
cd ~/22cob290-part2-team-10/prototype_nextjs

# Start prod docker (app & database)
# sudo docker compose -p t10gp-prod -f docker-compose.prod.yaml --env-file .env.docker up -d
# Maybe only use docker compose for mysql?
sudo docker compose -p t10gp-db --env-file .env.docker up -d

####### before this branch is merged with main
# Use MySQL prisma schema & migrations
cp prisma/mysql.prisma prisma/schema.prisma &&\
rm -r prisma/migrations &&\
cp -r prisma/mysql_migrations prisma/migrations

# Copy nginx config from project into VM
sudo cp nginx/app.conf /etc/nginx/conf.d/app.conf

# Restart nginx
sudo service nginx restart

# Not sure if will need these with PM2
cp .env.docker .env &&\
mv .env.development .env.development.bak &&\
pnpm i &&\
pnpm prisma generate &&\
pnpm prisma migrate deploy &&\
pnpm build

# Seed database (for testing/presentation)
# pnpm prisma db seed
#######

# Start app
# pnpm start
# pnpm start & # run in background
