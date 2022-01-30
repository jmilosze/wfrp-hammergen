###########
# BUILDER #
###########

FROM node:16 as builder
ARG build=build_container_staging

WORKDIR /frontend
COPY ./frontend/public ./public
COPY ./frontend/src ./src
COPY ./frontend/babel.config.js .
COPY ./frontend/package.json .
COPY ./frontend/.env.container_staging .

RUN npm install
RUN npm run-script $build

#########
# FINAL #
#########

FROM python:3.8.2-slim-buster

RUN addgroup --system appusergroup && adduser --system appuser && usermod -G appusergroup appuser

WORKDIR /app
COPY api ./api
COPY requirements_docker_build.txt ./requirements.txt
RUN mkdir -p static
RUN mkdir -p dist

COPY --from=builder /frontend/dist ./dist

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN chown -R appuser:appusergroup /app
USER appuser

CMD bash -c "cp -r /app/dist/* /app/static && gunicorn -w 1 -k gthread --threads 8 -b 0.0.0.0:5000 --log-level=debug api:create_app\(\)"
