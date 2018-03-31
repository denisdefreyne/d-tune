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
