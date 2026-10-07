# DevOps Launchpad

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

## Activate the pipeline

1. Create an empty GitHub repository called `devops-launchpad` (do not initialize it with a README).
2. Open a terminal in this extracted project folder and run:

```sh
git init
git add .
git commit -m "Build containerized DevOps Launchpad with CI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/devops-launchpad.git
git push -u origin main
```

Replace YOUR_USERNAME with your actual GitHub username. The push activates `.github/workflows/ci.yml`. In the repository's Actions tab, check the Test and build run. Tests must pass before Docker builds; a container must become healthy before the workflow succeeds. Pull requests receive the same checks. Hosted runner availability and billing depend on your GitHub account.

## What is implemented

- Responsive dashboard with real status from this app's backend; refreshes every 15 seconds.
- `GET /health` for container checks and `GET /api/status` for the UI.
- Integration tests for health, assets, configuration, missing paths and rejected writes.
- Non-root Docker image, Compose configuration and graceful shutdown.
- Continuous integration: syntax check, tests, image build and container smoke test.

## Next milestone: continuous deployment

This version implements CI; it does not publish an image or automatically deploy to a public server. Choose a hosting target first. A later deployment job can publish a commit-tagged image and update that host only after CI passes. Keep host credentials in GitHub Actions secrets. Add rollback and a post-deployment health check before calling the project complete CI/CD.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| PORT | 3000 | HTTP listening port |
| APP_VERSION | 1.0.0 | Release identifier shown in dashboard |
| APP_ENV | local | Environment label |

If changing PORT in Docker, also change the port mapping and exposed port as appropriate. CI sets APP_VERSION to the commit SHA.

## Explain it in an interview

“I built a Node.js app, containerized it as a non-root service, and automated integration tests, image builds and health verification with GitHub Actions. Every change must pass these checks before it is ready to deploy.”

Show a screenshot of the dashboard, a passing Actions run and the Docker health status as evidence. Don't claim production deployment until you have deployed it.

## References

- https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs
- https://docs.docker.com/guides/nodejs/
- https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
