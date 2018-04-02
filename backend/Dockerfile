FROM ruby:2.5-alpine

RUN apk update && apk upgrade

EXPOSE 9292

WORKDIR /srv/app

COPY Gemfile /srv/app
COPY Gemfile.lock /srv/app

RUN apk add sqlite taglib sqlite-libs && \
    apk add --virtual build-dependencies build-base ruby-dev sqlite-dev taglib-dev && \
    bundle install --path=vendor/bundle && \
    apk del build-dependencies

COPY . /srv/app

CMD ["bundle", "exec", "puma", "--config", "config/puma.rb"]
