FROM mysql:8.0

# Just for local development

ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_USER
ARG MYSQL_PASSWORD

ENV MYSQL_DEFAULT_AUTH=caching_sha2_password
ENV MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
ENV MYSQL_DATABASE=$MYSQL_DATABASE
ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD

# Add custom SQL scripts to be executed on startup
ADD ./scripts /docker-entrypoint-initdb.d/

# Expose the default MySQL port
EXPOSE 3306

# Start the MySQL server on container startup
CMD ["mysqld"]
