# Backend Implementation

This repository contains the backend implementation. The implementation follows the technical requirements provided in the task description.


## Installation
- On your desktop terminal run the command ```git clone https://github.com/Youngprinnce/vendease.git```
- Replace the DATABASE_URL with your preferred postgres url.
- Run command ```npm install``` to download project dependencies
- Install Docker if you dont already have it
- Run command ```docker compose up dev-db -d``` to create your development db on docker
- Run command ```npx prisma migrate dev``` to run database migrations
- Run command ```npm start``` to run the project



### Implemented Endpoints

- **Episode Resource**
  - `GET /episodes`: Episode list endpoint sorted by “releaseDate” from oldest to newest with each episode listed along with the count of comments
  - `POST /episodes`: Create new episodes.
  - `GET /episodes/:id`: Retrieve a single episode.
  -`DELETE /episodes/:id`: Delete a single episode.
  - `GET /episodes/character/:id`: Retrieve a List of Episodes a Character is featured in.

- **Comment Resource**
  - `GET /comments`: Retrieve all comments in reverse chronological order with the public IP address of the commenter and DateTime they were stored.

- **Characters**
  - `GET /characters`: Retrieve all characters
  - `POST /characters`: Create a character
  - `DELETE /characters/:id` DELETE A SINGLE CHARACTER
  - `GET /characters?gender=FEMALE&status=ACTIVE&sort=asc` TO GET ALL FEMALES THAT ARE ACTIVE AND SORTED IN ASCENDING ORDER. FOR EXAMPLE
    - `PATCH /characters/:id` UPDATE A SINGLE CHARACTER

- **Lcation**
  - `GET /locations`: Endpoint to retrieve all locations
  - `POST /locations`: Endpoint to create a location
  - `GET /locations/:id`: Endpoint to retrieve a single locations

## License

Nest is [MIT licensed](LICENSE).
