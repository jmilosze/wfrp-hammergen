.PHONY: dev-up
dev-up:
	docker compose -f docker-compose-test.yaml up --build -d

.PHONY: dev-down
dev-down:
	docker compose -f docker-compose-test.yaml down --rmi local -v

.PHONY: dev-restart
dev-restart: dev-down dev-up
