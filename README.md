# Localized Screenshots

Screenshots Automation Tool

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/getting-started/install), and [Docker](https://www.docker.com/) installed on your system.

### Development

-   Clone the project repository locally:

```bash
git clone https://github.com/Automattic/localized-screenshots.git
```

-   Set the environment variables in `.env`:

```bash
cd localized-screenshots
cp .env.example .env
```

-   Install the dependencies:

```bash
yarn install
```

-   Run locally:

```bash
yarn run dev
```

-   Open http://localhost:3003 in your browser.
-   For plugin development, use the WordPress environment at http://localhost:8888

### Debugging

#### Playwright

In order to run Playwright in debug mode, you need to set the [PWDEBUG environment variable](https://playwright.dev/docs/debug#pwdebug), for example:

```bash
PWDEBUG=1 yarn run dev
```
