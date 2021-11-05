# ChargeRemote

Example microservices scenario implemented with Nest.JS 

# Features
- Microservice architecture

  3 microservices:
  - `data-collector` when activated by GET request on `/`, fetches data from provided url and saves it to Postgres, and publishes message to Redis.
  - `data-processor` waits for message published by `data-collector` and starts processing fetched data and saves results to Postgres.
  - `data-exporter` acts as REST endpoint to retrieve processed data.
- Postgres database
- Redis Message Queue
- Fully dockerized, with ready to use docker-compose file
- Mock service for third party API
- Swagger endpoint for services with REST api

# Tests
Project includes *basic* unit tests in `data-collector` and `data-exporter` services.
To run these tests, simply run
```
npm run test
```
inside folders listed above.

# Possible Improvements

- TypeORM should not use `synchronize: true` option in production due to possible loss of data, but it's really handy in development.
- Add validation
- Add 4th service that acts as database provider for other services.
- Use more consistent naming scheme, eg. cars/vechicle.
- Improve test coverage.
- Refactor services to make UT easier

# Setup and Use

## Docker Compose
Easiest way to run this project is `docker-compose`.
I've added example `env.compose` file that can be used out of the box.
Just run command:
```
docker-compose up
```
and wait for add containers to build and spin up.
Then, visit [data-collector](http://localhost:3000/swagger) service, start the process, and visit [data-exporter](http://localhost:3002/swagger) service to get processed data

### Note
I've included mock service that acts as Mockachino due to it's weird rate limits.
If you wish to use original endpoint, change `DATACOLLECTOR_SOURCE_ADDRESS` in `.env.compose` to appropriate link.

## Terraform

<details>
<summary>Local</summary>
<br>

*In progress...*

</details>

<details>
<summary>AWS</summary>
<br>

*In progress...*

</details>
