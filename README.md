# 🗒️ TinkerJS

TinkerJS is a **browser-based coding environment for JavaScript with JSX support**, inspired by Jupyter Notebook. It 
allows you to write, transpile, and run code in modular cells instantly with live execution and preview. Built with a
secure sandbox for safe code evaluation, it's perfect for learning, experimenting, and prototyping.

## 🚀 Technologies

TinkerJS leverages modern web technologies and tools:

- **React / TypeScript** for reactive and type-safe UI development
- **ESBuild** for in-browser code bundling
- **Redux Toolkit (RTK)** for state management
- **Vite.js** for lightning-fast builds
- **Vitest** for unit testing
- **Express.js** for the backend API
- **Commander.js** for the CLI
- **Yarn Workspaces and Lerna** for monorepo management and publishing

## 📦 Packages

TinkerJS is a monorepo with three core packages:

- **tinker-js**: Command-line interface for running the app locally
- **@tinker-js/local-api**: Express.js API layer
- **@tinker-js/ui**: React-based UI

The `tinker-js` package is the main package for end-users.

## 📥 Installation and Usage

### Quick Start with NPX

```shell
npx tinker-js serve [<file_path>] [--port <number>]
```

### Global Installation

#### yarn

```shell
yarn global add tinker-js
```

#### npm

```shell
npm install -g tinker-js
```

#### Run the executable

```shell
tinker-js serve [<file_path>] [--port <number>]
```

This will launch TinkerJS locally, accessible via your web browser.

Notebooks are stored as `*.tjs` JSON files. If no file path is provided, TinkerJS will open a default `notebook.tjs` in
the current directory.

## 🛠️ Development

### Installing Dependencies

Clone the repository and install all dependencies across the monorepo:

```shell
yarn install
```

### Running in Development Mode

Start the development server:

```shell
yarn dev
```

### Publishing with Lerna

To publish the packages to NPM:

```shell
yarn lerna publish
```


---

TinkerJS is built for developers who want to explore and experiment with code directly in the browser, combining the
flexibility of modern tooling with a seamless, sandboxed coding experience.

