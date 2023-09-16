# Movie Rater

<div align="center">
  <a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45">
  </a>
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
    <img src="https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png" width="45">
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" width="45">
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
    <img src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" width="45">
  </a>
  <a href="https://jestjs.io/" target="_blank" rel="noreferrer">
    <img src="https://jestjs.io/img/jest.png" width="45">
  </a>
</div>

✨ **Tech Stack** ✨

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [Nx](https://nx.dev/)
- [Redis](https://redis.io/)
- [Jest](https://jestjs.io/)

## Introduction

This project allows for anonymous movie ratings and reviews. Built using a Monorepo architecture with Nx, it capitalises on Nx's efficient dependency graph, scalable workspace, and unified codebase management to offer a streamlined development experience.

## Prerequisites

Before deploying any REST APIs, it's essential to have a Redis server up and running. You can find a guide on setting up a Redis server and CLI on macOS [here](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/).

## Project Structure

The project employs a Monorepo structure built using Nx, enabling unified codebase management and efficient development.

```
packages/
  ├── backend/
  │    ├── common/          # Library to separate out common logic
  │    └── services/
  │         ├── movies/     # REST API for creating and fetching movies
  │         └── reviews/    # REST API for creating and fetching movie reviews
  └── frontend/
       └── next-app/        # Next.js front-end application
```

## Useful Commands

### Run the movies REST API:

```bash
nx serve movies
```

### Run the reviews REST API:

```bash
nx serve reviews --port 9239  # Define the port as the movies API occupies the default port for nx inspection
```

### To run thefrontend:

```bash
nx serve frontend-next-app
```

### To run tests:

Test a specific service:

```bash
nx test backend-common
```

### To run tests on multiple services:

```bash
nx run-many -t test frontend-next-app backend-common movies reviews
```

### To Lint:

Lint a specific service:

```bash
nx lint frontend-next-app
```

## Screenshots

<div align="center">
  <a href="https://ibb.co/brn9G1c">
    <img src="https://i.ibb.co/brn9G1c/Screenshot-2023-09-14-at-02-59-41.png" alt="Screenshot-2023-09-14-at-02-59-41">
  </a>
  <a href="https://ibb.co/26YJ057">
    <img src="https://i.ibb.co/26YJ057/Screenshot-2023-09-14-at-03-00-12.png" alt="Screenshot-2023-09-14-at-03-00-12" border="0">
  </a>
  <a href="https://ibb.co/yhs02F3">
    <img src="https://i.ibb.co/yhs02F3/Screenshot-2023-09-14-at-03-00-36.png" alt="Screenshot-2023-09-14-at-03-00-36" border="0">
  </a>
<a href="https://ibb.co/RCF9Szg"><img src="https://i.ibb.co/64MmZgy/Screenshot-2023-09-14-at-06-00-28.png" alt="Screenshot-2023-09-14-at-06-00-28" border="0"></a>
</div>

## Nx Tasks

To execute tasks with Nx, use the following syntax:

```bash
nx <target> <project> <...options>
```

Run multiple targets:

```bash
nx run-many -t <target1> <target2>
```

## Additional Resources

- [Setting up Remote Caching with Nx](https://nx.dev/core-features/share-your-cache)
- [Distributing Task Execution Across Multiple Machines](https://nx.dev/core-features/distribute-task-execution)
- [CI Setup Guide](https://nx.dev/recipes/ci)
