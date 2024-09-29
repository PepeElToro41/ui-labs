# Contributing to UI Labs

Thank you for your interest in contributing to UI Labs! Contributions are welcome and greatly appreciated.

Please follow these guidelines while contributing to the project.

## About the Project

UI Labs is a storybook plugin for Roblox that allows you to visualize stories in real-time. The goal of this plugin is to provide an intuitive, customizable and feature rich tool for developers. This plugin will be always free and open-source.

---

# Contributing in the Plugin

For contributing in the plugin codebase, please follow these steps:

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.x or higher)
-   [Rojo](https://rojo.space/) (v7.x or higher)
-   [npm](https://www.npmjs.com/)

### Technical Requirements

-   Typescript Knowledge
-   React-luau Knowledge _(UI Labs is currently being ported to [Vide](https://centau.github.io/vide/))_
-   JSX Knowledge

### 1. Fork the repository to your GitHub account and clone it to your local machine.

```bash
git clone https://github.com/YOUR_USERNAME/ui-labs.git
```

### 2. Navigate to the project directory.

```bash
cd ui-labs
```

### 3. Install the dependencies.

```bash
npm install
```

### 4. Compile Roblox-TS.

```bash
npm run watch
```

_If this doesn't work, try installing roblox-ts globally first._

```bash
npm install -G roblox-ts
```

This should compile correctly, where the output prints `Found 0 errors. Watching for file changes.` If this is not the case, the code most likely was accidentally pushed with typing errors, Reaching out to me or creating an issue will be needed.

### 5. Syncing Rojo

You need to sync rojo with the file `serve.project.json` using the command line or the rojo plugin

```bash
rojo serve
```

### 6. Testing UI Labs

Now you can connect Rojo in your Roblox place. This will sync the files at `ServerScriptService/UILabs`.

To test the plugin locally, mount the story at `UILabs/Stories/UILabs.story`. This story should work with any storybook plugin like Hoarcekat or UI Labs itself. If you are using UI Labs to preview it, it's recommended to use `Mount On Viewport`.

This story will have have features that require plugin APIs disabled such as `View On Viewport`. To test these, save the **UILabs** folder as a local plugin

### 7. Making a pull request

When you’re ready to submit your changes, please follow these steps:

-   Ensure your changes are tested and roblox-ts compiles correctly.
-   Conventional commit formats are preferred yet not required:

```bash
git commit -m "feat: describe your feature, fix: describe your fix, docs: describe your documentation"
```

-   Push your branch:

```bash
git push origin main
```

-   Open a Pull Request on GitHub.

---

# Contributing with Issues and Feature Requests

If you encounter a bug, have a feature request or UX improvements, [create an issue](https://github.com/PepeElToro41/ui-labs/issues/new/choose) on GitHub.

-   For bugs, include screenshots, error logs, reproduction steps and your code snippets.
-   For feature requests, include a clear and concise description of the feature, why it would be useful, how it would be implemented and potential alternatives or workarounds.

---

# Contributing in the Documentation

Contributing in the documentation is really appreciate it as it's very hard to do for me.

Writing documentation doesn't require technical knowledge of the codebase, but you need to know what you are documenting.

### 1. Nagivate to the `docs` folder.

Once you have cloned the repository, navigate to the `docs` folder.

```bash
cd docs
----------
code .
```

### 2. Install the dependencies.

```bash
npm install
```

### 3. Start the documentation server.

```bash
npm run docs:dev
```

This will start the documentation server, go to a browser and open the url http://localhost:5173 to view the changes in real time.

### 4. Make changes to the documentation.

You can find the documentation files in the `docs` folder at `ui-labs/docs/docs/`.

The documentation is written in markdown and uses [vitepress](https://vitepress.dev/). Visit the Vitepress documentation to learn how to write it.

### 5. Make a pull request.

It's important that you build the documentation before to make sure the documentation builds correctly.

```bash
npm run docs:build
------------------------
npm run docs:preview
```

If the build is successful, you can create a pull request to the main repository detailing the changes you made.


# Contributing by Sponsoring

UI Labs is *and always will be* a free and open-source project.

This project is always growing and improving, trying to be the best storybook plugin on roblox. 

Sponsoring is a great way to support the project and allow me to give more time to work on it.