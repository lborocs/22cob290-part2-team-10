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

# not sure if it will be needed after merge
cp .env.docker .env &&\
pnpm i &&\
pnpm prisma generate &&\
pnpm prisma migrate deploy &&\ # make sure db is running first
pnpm build

# Seed database (for testing/presentation)
pnpm prisma db seed
#######

# Start app
# pnpm start
# pnpm start & # run in background
