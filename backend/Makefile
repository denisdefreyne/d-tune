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

.PHONY: index
index:
	bin/index -m /Volumes/Champlain\ Music/Music -d data/music.db

.PHONY: redeploy
redeploy: index docker-build docker-push deploy

.PHONY: sync
sync:
	rsync --archive --itemize-changes --8-bit-output --delete --iconv=utf-8-mac,utf-8 /Volumes/Champlain\ Music/Music/ alvar:/srv/music
	ssh alvar b2 sync --compareVersions size /srv/music b2://denis-music/Music
