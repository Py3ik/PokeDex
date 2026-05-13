# PokeDex App

A full-stack web application for creating and managing personal Pokemon collections. Browse Pokemon from the PokeAPI, build teams, export them to JSON, and import them back.

## Stack

| Layer    | Technology                                                                        |
| -------- | --------------------------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, TailwindCSS, DaisyUI, TanStack Query, React Router v6 |
| Backend  | NestJS, MongoDB (Mongoose), `@nestjs/axios`, class-validator, Swagger             |
| Database | MongoDB                                                                           |
| Infra    | Docker, Docker Compose                                                            |

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### 1. Clone the repository

```bash
git clone <repo-url>
cd pokemon-app
```

### 2. Create the environment file

Create a `.env` file in the project root:

```env
# Ports
SERVER_PORT=3000
CLIENT_PORT=5173

# Server
MONGO_URI=mongodb://mongo:27017/pokemon-app
POKEAPI_URL=https://pokeapi.co/api/v2
CLIENT_URL=http://localhost:5173
MAX_TOTAL_WEIGHT=1300
MIN_SPECIES=3

# Client (Vite)
VITE_API_URL=http://localhost:3000
VITE_MAX_TOTAL_WEIGHT=1300
VITE_MIN_SPECIES=3
VITE_PAGINATION_LIMIT=12
```

### 3. Run

**macOS / Linux:**

```bash
make run
```

**Windows:**

```bash
docker compose up --build
```

The app will be available at [http://localhost:5173](http://localhost:5173).  
API docs (Swagger) at [http://localhost:3000/api](http://localhost:3000/api).

## Features

- Browse Pokemon with pagination (fetched from [PokeAPI](https://pokeapi.co))
- Search Pokemon by name
- Create a named collection by selecting Pokemon
- View, delete collections
- **Export** a collection to a `.json` file (stores only Pokemon IDs)
- **Import** a `.json` file — the server re-fetches all Pokemon data from PokeAPI by ID, so client-side data cannot be tampered with
- Duplicate collection names are automatically suffixed: `My Team`, `My Team (1)`, `My Team (2)`, etc.

### Validation rules (configurable via `.env`)

| Rule                   | Default |
| ---------------------- | ------- |
| Minimum unique species | 3       |
| Maximum total weight   | 1300 hg |

## API Endpoints

| Method   | Path                    | Description                                   |
| -------- | ----------------------- | --------------------------------------------- |
| `GET`    | `/pokemon`              | Paginated Pokemon list                        |
| `GET`    | `/pokemon/search?name=` | Search by name                                |
| `GET`    | `/collections`          | Paginated collections                         |
| `GET`    | `/collections/:id`      | Single collection                             |
| `POST`   | `/collections`          | Create collection (send full Pokemon objects) |
| `POST`   | `/collections/import`   | Import collection by `{ name, pokemonIds[] }` |
| `DELETE` | `/collections/:id`      | Delete collection                             |
