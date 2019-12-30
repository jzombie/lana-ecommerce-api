# Prototype TypeScript API Backend w/ MySQL & Winston Logger

An online shopping checkout system as a standalone NodeJS API.

## Dependencies
In order to run this you will need the following installed on your system:

  - Docker (Tested w/ version 18.09.7, build 2d0083d)
  - Docker Compose (Tested w/ version 1.24.1, build 4667896b)

## Testing

If in a Unix environment:
```
$ ./test.sh
```

Otherwise, if in Windows (this was protoyped in Linux so Docker commands may vary):
```
docker ps # To find the container id
docker exec -ti {container_id} bash # To enter the container

npm run test # To run the test scripts
```

## Postman collection

The Postman collection and environment file can be found within the <rootDir>/dev directory.

## Logging

Logging is handled via Winston.

Logging configuration is currently hardcoded in /src/logger.ts.

The current output files are:

  - combined.log (all log levels)
  - error.log

## MySQL

Sequelize is utilized as an ORM for MySQL.  MySQL is spun up in the included Docker Compose configurations.

Note, the products in this test environment are originally seeded from <rootDir>/src/test.baseProducts.ts
via the <rootDir>/src/sequelize/index.ts script.