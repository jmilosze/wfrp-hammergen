FROM google/cloud-sdk:412.0.0-slim

WORKDIR /app

RUN curl -L https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian11-x86_64-100.6.1.deb > mongodb-database-tools-debian11-x86_64-100.6.1.deb && \
    apt install ./mongodb-database-tools-debian11-x86_64-100.6.1.deb && rm mongodb-database-tools-debian11-x86_64-100.6.1.deb

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]