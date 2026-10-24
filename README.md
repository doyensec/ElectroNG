<img src=".erb/img/erb-banner.png" width="100%" />
<p>
  <a href="https://get-electrong.com">ElectroNG</a> is a tool to identify misconfigurations and security anti-patterns in Electron-based applications.
Software developers and security auditors can use this tool to identify potential weaknesses and implementation bugs when developing applications using <a href="https://www.electronjs.org/">ElectronJS</a>. A good understanding of Electron (in)security is still required when using ElectroNG, as some of the potential issues detected by the tool require manual investigation.

> [!IMPORTANT]
> **ElectroNG** last received major updates in 2024, with only minor fixes since then. As Electron has evolved, some scanning capabilities have fallen behind, and results on modern Electron applications may be incomplete or suboptimal.
>
> This is why we’ve open-sourced ElectroNG! 🚀 We’re hoping the community can help us modernize the tool, improve its detection capabilities, and make ElectroNG a go-to security scanner for Electron applications again.

ElectroNG is the successor of [Electronegativity](https://github.com/doyensec/electronegativity), another open source tool maintained by Doyensec.

It is based on the React Boilerplate built upon <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>. The core functionality of the tool is provided by [ElectroNG-core](https://github.com/doyensec/ElectroNG-core).

</p>

## Use ElectroNG

Download the latest release from the [Releases](https://github.com/doyensec/ElectroNG/releases) page, and run it as a standard application.

The entire product documentation is available on the official website: [https://get-electrong.com/](https://get-electrong.com/)

## Automatic updates

Automatic updates are **disabled by default**. ElectroNG does not check for or download updates unless you opt in.

To enable them, check **Automatic Updates** in the application menu (**ElectroNG** menu on macOS, **Help** menu on Windows and Linux). Once enabled, ElectroNG checks for updates at startup and asks for confirmation before downloading and installing a new version. You can disable the option again at any time.

When enabled, updates are downloaded from a private Amazon S3 bucket operated by Doyensec (`electrong-software`, region `us-west-2`), not from GitHub Releases. If you build ElectroNG from source and want to ship your own updates, change the `build.publish` section of `package.json` and `src/dev-app-update.yml` to point to your own update server.

## Run from the source code

The following script will allow you to clone the latest version and run it:

```bash
git clone git@github.com:doyensec/ElectroNG.git && cd ElectroNG
nvm use
# ----------
# in case nvm complains about python or fails during compilation use https://github.com/Schniz/fnm
# ----------
git clone git@github.com:doyensec/ElectroNG-core.git ./ElectroNG-core
cd ElectroNG-core
npm install .
npm run build
cd ..
yarn add file:ElectroNG-core
yarn install
yarn run start
```

- **If you have installation or compilation issues with this project, please refer to [this debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

### Signing and notarizing macOS builds

Code signing credentials are not included in this repository. To produce a signed and notarized macOS build, provide your own Apple Developer credentials through environment variables before running `yarn package` or `yarn publish`:

```bash
export CSC_LINK=<base64-encoded Developer ID .p12 certificate>
export CSC_KEY_PASSWORD=<.p12 password>
export APPLE_ID=<your Apple ID>
export APPLE_APP_SPECIFIC_PASSWORD=<app-specific password>
export APPLE_TEAM_ID=<your team ID>
```

Unsigned development builds (`yarn start`) do not need any of these.

## Contributing

Contributions are welcome! Please take a look at our [CONTRIBUTING.md](https://github.com/doyensec/ElectroNG-core/blob/main/CONTRIBUTING.md) before opening an issue or a pull request. New checks and scanning logic live in [ElectroNG-core](https://github.com/doyensec/ElectroNG-core); this repository contains the desktop user interface.

## Credits

ElectroNG was made possible thanks to the work of many [contributors](https://github.com/doyensec/electrong/graphs/contributors).

This project is sponsored by [Doyensec LLC](https://www.doyensec.com).

![Doyensec Research](https://github.com/doyensec/inql/blob/master/docs/doyensec_logo.svg 'Doyensec Logo')

[Engage us to break](https://doyensec.com/services/electronjs-based-applications.html) your Electron.js application!

## License

This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
