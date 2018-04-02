.PHONY: default
default: dependencies

.PHONY: dependencies
dependencies:
	@echo === Installing dependencies…
	bundle install
	@echo

.PHONY: run
run:
	bundle exec rackup

.PHONY: docker-build
docker-build:
	docker build -t docker.denis.ws/d-tune-backend .

.PHONY: docker-push
docker-push:
	docker push docker.denis.ws/d-tune-backend
