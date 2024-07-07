FROM golang:1.22.2-alpine3.18 AS build

WORKDIR /src
ADD api-go /src
RUN CGO_ENABLED=0 go build -o ./bin/wfrp ./cmd/wfrp/main.go
RUN echo "nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin" > passwd && chmod 644 passwd

FROM scratch

WORKDIR /app
COPY --from=build /src/bin/. ./

COPY --from=build /src/passwd /etc/passwd
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

USER nobody

CMD ["/app/wfrp"]
