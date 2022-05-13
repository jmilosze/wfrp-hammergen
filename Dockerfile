FROM golang:1.18.2-alpine3.15 AS build

WORKDIR /src
COPY . /src
RUN CGO_ENABLED=0 go build -o ./bin/ ./cmd/...
RUN echo "nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin" > passwd && chmod 644 passwd

FROM scratch

COPY --from=build /src/bin/wfrp /

COPY --from=build /src/passwd /etc/passwd
USER nobody

CMD ["/wfrp"]