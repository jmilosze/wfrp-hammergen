FROM python:3.11.2-slim-buster

RUN addgroup --system appusergroup && adduser --system appuser && usermod -G appusergroup appuser

WORKDIR /app
COPY api ./api
COPY requirements.txt ./requirements.txt

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

RUN chown -R appuser:appusergroup /app
USER appuser

ENV PYTHONUNBUFFERED True

CMD bash -c "gunicorn --threads 8 --workers 1 --timeout 0 -k gthread -b :$PORT --log-level=debug api:create_app\(\)"
