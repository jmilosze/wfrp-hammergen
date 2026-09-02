.PHONY: dev-up
dev-up:
	docker compose -f docker-compose.yaml up --build -d

.PHONY: dev-down
dev-down:
	docker compose -f docker-compose.yaml down --rmi local -v

.PHONY: dev-restart
dev-restart: dev-down dev-up

.PHONY: wait-wfrp
wait-wfrp:
	@echo "Waiting for wfrp (http://localhost:8081/api/keepwarm)..."
	@for i in $$(seq 1 60); do \
		if curl -s -f http://localhost:8081/api/keepwarm > /dev/null 2>&1; then \
			echo "wfrp is ready."; \
			exit 0; \
		fi; \
		sleep 1; \
	done; \
	echo "Timed out waiting for wfrp"; \
	exit 1

.PHONY: wait-ready
wait-ready: wait-wfrp

.PHONY: test
test: dev-restart wait-wfrp
	cd ./api-go/test/integration && go test -v -count=1  -args -parallel
