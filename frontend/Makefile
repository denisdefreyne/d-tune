.PHONY: default
default: dependencies

.PHONY: dependencies
dependencies:
	@echo === Installing dependencies…
	npm install
	@echo

.PHONY: run
run:
	npm start

.PHONY: build
build:
	@echo === Building…
	rm -rf dist
	npm run build
	@echo

.PHONY: deploy
deploy:
	@echo === Deploying…
	scripts/deploy
	@echo
