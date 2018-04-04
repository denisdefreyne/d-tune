.PHONY: default
default: test

.PHONY: test
test:
	@echo There are no tests…

.PHONY: deploy
deploy:
	make -C backend docker-build docker-push deploy
	make -C frontend build deploy
