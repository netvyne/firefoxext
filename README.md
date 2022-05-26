<p align="center">
  <a href="https://netvyne.com"><img src="https://www.netvyne.com/logo-full.png" alt="Netvyne" width="300" /></a> 
</p>
<p align="center">
  <img src="assets/extension_screenshot.jpg" alt="Extension Screenshot" width="459" />
</p>
<p align="center">
  Credible Comments, One Click Away
</p>

## Quick Links

- [Features](#features)
- [Contributing](#contributing)
- [Download](https://chrome.google.com/webstore/detail/netvyne-extension/hdmpoglhdchngeiefpiaiilfeicjjfap)

## Features

- Eliminate the need for account juggling as you visit different sites
- Join in conversation with fellow members of the Netvyne community
- Share pages with your friends, and start a discussion
- Include screenshots natively when sharing with friends
- Get fast, friendly support from the Netvyne team

## Development

After checking out the repo run the follow these steps

```shell
export NODE_ENV="production"
$ yarn install
$ npm run build
```

## Operating system

Code has been tested on the following operating systems

| Operating System | Version |
|------------------|------------|
| macOS X | \>= 10.9 |
| Windows | \>= v0.12.0 |
| Ubuntu | \>= 12.04 |

## Build environment

| Node | \>=v16.13.1 |
|------------------|------------|
| npm | \>= 8.3.0 |


## Contributing

If you encounter any issues with the extension, or if there's something you'd like to see added, please open an issue on Github!

Also, if you'd like to contribute code, you're more than welcome to do so! Please make an issue first so that we can discuss and be on the same page.

Note: If you wish to reduce the permissions needed at the cost of eliminating the comment count badge, you should be able to do so by updating the following files:

- `manifest.json` -> remove "tabs" permission
- `component.tsx` -> remove references to "chrome.tabs" (use activeTab instead)

---
&copy; 2021-2022 Netvyne, Inc.
