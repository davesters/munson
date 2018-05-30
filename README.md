# Munson

Don't be up a creek without a paddle. Have the world in the palm of your hand with this MVC type framework for nodejs.

Munson is a Typescript MVC type framework for nodejs built on top of Express. Using fancy things like routing, controllers, decorators, IoC containers, config builders and the like, Munson gives you all the tools you need to spin up quick and easy web applications with some semblence of structure.

## Getting Started

These instructions will get you up and running quickly with Munson. First, add Munson to your project.

```
npm install munson

// or

yarn add munson
```

Now you can initialize Munson in your start up code, and then create your first controller.

```
// start.ts
import { App } from 'munson';

const app = new App();
const port = process.env.PORT;
app.start()
  .then(() => {
    console.log(`App listening on port ${port}`);
  });


// Controllers/MainController.ts
import { Controller, HttpController, Get } from 'munson';

@Controller
export default class MainController extends HttpController {

  @Get('/')
  public index() {
    this.response.send('You just got munsoned');
  }
}
```

That's it! Now, equipped with this simple example, you have all the tools you need to build your enterprise node app.

Oh, you need more info? Take a look at the Todo MVC example app, or keep reading for more info on all the components.

Todo MVC example app

## API Documentation

Coming Soon...

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases on this repository](https://github.com/davesters/munson/releases).

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/davesters/munson/blob/master/LICENSE.md) file for details