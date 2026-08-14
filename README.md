# NextSpot

NextSpot is a private-by-default, multi-user travel journal. Public registration and login are available; after signing in, each user manages only their own Places, Stays, Memories, and Collections. A clearly labeled shared public demo lets visitors try the workflows; its data resets on each deployment.

See [CONTEXT.md](CONTEXT.md) for product language and the legacy schema/API mapping.

## Stack

React, Redux, Flask, SQLAlchemy, PostgreSQL, and Tailwind CSS.

## Local setup

1. Create a PostgreSQL database and user, then copy `.env.example` to `.env` and configure it.
2. Install backend dependencies with `pipenv install`, then enter the environment with `pipenv shell`.
3. Install frontend dependencies with `cd frontend && npm install`.
4. From the repository root run `flask db upgrade` and `flask seed all`. Use `flask seed demo` whenever you need to reset only the shared demo journal.
5. Run Flask with `flask run`.
6. In another terminal run `cd frontend && npm start`.

The existing container/deployment configuration remains the production deployment shape. Photos are remote HTTP(S) URLs; uploads, maps, integrations, and social sharing are intentionally out of scope.
