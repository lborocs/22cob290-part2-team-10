# Start prop docker (app & database)
# sudo docker compose -p t10gp-prod -f docker-compose.prod.yaml --env-file .env.docker up -d
# Maybe only use docker compose for mysql?
sudo docker compose -p t10gp-db --env-file .env.docker up -d

# Enter part 2 of project
cd ~/22cob290-part2-team-10/prototype_nextjs

####### before this branch is merged with main
git switch nginx-pm2

# not sure if it will be needed after merge
git checkout .. && git pull &&\
cp .env.docker .env &&\
pnpm i &&\
pnpm prisma generate &&\
pnpm prisma migrate deploy &&\ # make sure db is running first
pnpm build
#######

# Start app
# pnpm start
