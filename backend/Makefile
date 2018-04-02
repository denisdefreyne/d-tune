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

.PHONY: deploy
deploy:
	ssh hayward -- \
		docker pull docker.denis.ws/d-tune-backend
	ssh hayward -- \
		docker stop d-tune-backend
	ssh hayward -- \
		docker rm d-tune-backend
	ssh hayward -- \
		docker run \
		--detach \
		--restart=always \
		--publish=9292:9292 \
		--name=d-tune-backend \
		docker.denis.ws/d-tune-backend
