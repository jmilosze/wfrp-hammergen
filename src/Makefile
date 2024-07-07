.PHONY: dev-up
dev-up:
	docker compose -f docker-compose-test.yaml up --build -d

.PHONY: dev-down
dev-down:
	docker compose -f docker-compose-test.yaml down --rmi local -v

.PHONY: dev-restart
dev-restart: dev-down dev-up

.PHONY: test
test:
	cd ./api-go/test/integration && go test -v -count=1  -args -parallel

.PHONY: test-memdb
test-memdb:
	cd ./api-go/test/integration && go test -v -count=1  -args -parallel -url "http://localhost:8082"
