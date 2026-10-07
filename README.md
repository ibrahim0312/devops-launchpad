# DevOps Launchpad

[![CI](https://github.com/ibrahim0312/devops-launchpad/actions/workflows/ci.yml/badge.svg)](https://github.com/ibrahim0312/devops-launchpad/actions/workflows/ci.yml)

**[Live demo](https://devops-launchpad.onrender.com/) · [Source code](https://github.com/ibrahim0312/devops-launchpad) · [Health endpoint](https://devops-launchpad.onrender.com/health)**

A portfolio project that packages a Node.js web app in Docker and validates every push and pull request with GitHub Actions. The dashboard displays the current app instance's health, uptime, environment and release version. It is not a monitor for external services.

## Start here

Install Node.js 24 or newer, then open a terminal inside this folder:

```sh
npm start
```

Open http://localhost:3000. No npm dependencies or installation step are needed. Stop with Ctrl+C.

```sh
npm run check
npm test
```

## Run in Docker

With Docker Desktop or Docker Engine and the Compose plugin installed:

```sh
docker compose up --build -d
docker compose ps
```

Open http://localhost:3000. Inspect logs and stop the service:

```sh
docker compose logs -f
docker compose down
```

The container runs as the unprivileged node user. Its health check calls /health. Compose adds a read-only filesystem and drops Linux capabilities.

## GitHub Actions pipeline

The workflow in `.github/workflows/ci.yml` runs on pushes, pull requests and manual triggers. It checks JavaScript syntax, runs six integration tests, builds a Docker image, then starts the container and waits for its health check to pass. A failing step fails the workflow.

## Deployment on Render

The live service builds this repository's Dockerfile on Render. The service is configured to deploy the `main` branch **After CI Checks Pass**, with `/health` as its HTTP health check path.

Delivery flow: push to main → GitHub Actions checks → Render builds the Dockerfile → Render verifies health → updated app goes live.

Automatic deployment was verified by pushing a heading change and seeing it appear on the public site after CI passed. Pull requests run CI without updating the main-branch service. The CI image is used for verification; Render builds its own deployment image from the repository.

The demo uses Render's free instance, which can sleep after inactivity. Uptime measures the current process and resets on restart or deployment. Release and environment labels come from APP_VERSION and APP_ENV; the public release label is not automatically synchronized with the commit SHA.

## What is implemented

- Responsive dashboard with real status from this app's backend; refreshes every 15 seconds.
- `GET /health` for container checks and `GET /api/status` for the UI.
- Integration tests for health, assets, configuration, missing paths and rejected writes.
- Non-root Docker image, Compose configuration and graceful shutdown.
- Continuous integration: syntax check, tests, image build and container smoke test.
- Continuous deployment on Render after passing CI, with an HTTP health check.

## Screenshots

To document the project, save screenshots of the live dashboard, a passing Actions run, and a successful Render deployment in a `docs/` folder. Then add their relative image links here. No screenshot files are included yet.

## Future improvements

- Display a unique deployed commit identifier in the dashboard.
- Verify that failing CI prevents deployment with a controlled test branch.
- Document and test a rollback procedure.
- Add external monitoring for the public service.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| PORT | 3000 | HTTP listening port |
| APP_VERSION | 1.0.0 | Release identifier shown in dashboard |
| APP_ENV | local | Environment label |

If changing PORT in Docker, also change the port mapping and exposed port as appropriate. CI sets APP_VERSION to the commit SHA.

## Explain it in an interview

“I built and deployed a containerized Node.js app with six integration tests. GitHub Actions verifies each change, and Render automatically deploys main after CI passes and verifies the service health.”

Use the live demo, passing Actions run and Render deployment history to demonstrate the delivery flow.

## References

- https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs
- https://docs.docker.com/guides/nodejs/
- https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
