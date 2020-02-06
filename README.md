# ementas-discord-bot
A simple discord bot that shows the ESTGV menu
## Table of Contents
- [Continuous Integration](#continuous-integration)
- [Quick Start](#quick-start)
- [Further Reading](#further-reading)
- [Disclaimer](#disclaimer)
- [Author](#author)
- [License](#license)
## Continuous Integration
[![Build Status](https://travis-ci.com/Guergeiro/ementas-discord-bot.svg?branch=master)](https://travis-ci.com/Guergeiro/ementas-discord-bot)

Auto-deploy to :cloud: [heroku](https://www.heroku.com/).
## Quick Start
1. Fork or clone this repository
    ```bash
    $ git clone https://github.com/Guergeiro/ementas-discord-bot/
    $ cd ementas-discord-bot/
    ```
2. Clean project
    ```bash
    $ npm run clean
    ```
3. Install dependencies
    ```bash
    # Install all dependencies
    $ npm install
    ```
4. (Development) Run Dev App
    ```bash
    $ npm run dev
    ```
5. (Production) Compile TypeScript
    ```bash
    $ npm run compile
    ```
6. (Production) Run a clean install
    ```bash
    $ npm run clean-install --only=production
    ```
7. (Production) Run the App
    ```bash
    $ npm run start
    ```
## Further Reading
As you can see in [config.env](https://github.com/Guergeiro/ementas-discord-bot/blob/master/src/config.env), some things are required for this bot to work.
1. :robot: **Discord Bot Token** - read more about [Discord Apps](https://discordapp.com/developers/docs/intro)
2. :globe_with_meridians: **Zamzar API Key** - read more about [Zamzar](https://developers.zamzar.com/)
3. :construction: **API URL** - should be changed according to prod or dev environment
4. :rocket: **PORT** - port for the simple http server that keeps the bot alive

    :heavy_exclamation_mark: *Note*: this is only required in **development**. While in **production**, please use environment variables that your provided allows you to give.
## Disclaimer
This project was created with NPM version 6 in mind. Any backwards compatibility is not guaranteed.
## Author
Created by [Breno Salles](https://brenosalles.com).
## License
This project is licensed under [MIT License](https://github.com/Guergeiro/ementas-discord-bot/blob/master/LICENSE).