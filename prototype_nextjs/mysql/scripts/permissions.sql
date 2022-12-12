-- grant privileges so prisma migrate dev works (something about creating shadow database)
GRANT ALL PRIVILEGES ON *.* TO 'johndoe'@'%' WITH GRANT OPTION;
