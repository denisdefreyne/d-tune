.PHONY: default
default: dependencies

.PHONY: dependencies
dependencies:
	@echo === Installing dependencies…
	npm install
	@echo

.PHONY: run
run:
	API_URL=http://localhost:9292 npm start

.PHONY: build
build:
	@echo === Building…
	rm -rf dist
	API_URL=https://d-tune.denis.ws/api npm run build
	@echo

.PHONY: deploy
deploy:
	@echo === Deploying…
	scripts/deploy
	@echo
