# ALTEXPRESS Backend Engine

## Get started

1. Create a controller: 

``` ts
import { Request, Response, Module, Controller, Get, Post, Put, Delete } from "@altcrm/altexpress";

@Controller("/clients")
export class ClientController {

    @Get("/:id")
    public async get(req: Request, res: Response): Promise<void> {
        const client = await service.findById(req.params.id);
        res.status(200).json({ client });
    }
}
```

2. Create a module:

``` ts
@Module({
    controllers: [ClientController]
})
export class ApplicationModule {}
```

3. Create an application:

``` ts
import { Application } from "@altcrm/altexpress";
import { ApplicationModule } from "./application.module";

async function startServer(port: number): Promise<void> {
    try {
        // create application and specify main module
        const app = new Application(ApplicationModule);

        // - !!! DO NOT USE !!! "express.urlencoded", "express.json" -
        // - already defined inside the "Application":
        // app.use(express.urlencoded({ extended: true }));
        // app.use(express.json());
        
        // - to specify global API prefix:
        // app.setGlobalPrefix("/api/v1");

        // - to specify middlewares:
        // app.use(morgan("dev"));
        // app.use(cors());

        console.log("Starting API...");
        await app.listen(port);
        console.log(`Server is running on port ${port}`);
    } catch (e) {
        console.error(e);
    }
}

// start the server
startServer(3000);
```

## Tricks

### API Versioning

1. Create controllers and modules for your business logic:

``` ts
@Controller("/clients")
export class ClientControllerV1 {

    @Get("/:id")
    public async get(req: Request, res: Response): Promise<void> {
        // ...
    }
}

@Controller("/clients")
export class ClientControllerV2 {

    @Get("/:id")
    public async get(req: Request, res: Response): Promise<void> {
        // ...
    }
}

@Module({
    controllers: [ClientControllerV1]
})
export class ClientModuleV1 {}

@Module({
    controllers: [ClientControllerV2]
})
export class ClientModuleV2 {}
```

2. Create modules for different API versions with prefix specified:

``` ts
@Module({
    prefix: "/api/v1",
    modules: [ClientModuleV1]
})
export class ApiModuleV1 {}

@Module({
    prefix: "/api/v2",
    modules: [ClientModuleV2]
})
export class ApiModuleV2 {}
```

3. Add modules to main application module:

``` ts
@Module({
    modules: [ApiModuleV1, ApiModuleV3]
})
export class ApplicationModule {}

```

Now the both routes are available:

```
/api/v1/clients/11111
/api/v2/clients/22222
```

### Middlewares

1. Create a middleware (for example, guard for authentication):

``` ts
import passport from "passport";

export default class Guard {
    public static Auth = passport.authenticate("jwt", { session: false });
}

```

2. Add middleware to method decorator:

``` ts
@Controller("/clients")
export class ClientController {

    @Get("/:id", Guard.Auth)
    public async get(req: Request, res: Response): Promise<void> {
        // ...
    }
}
```

