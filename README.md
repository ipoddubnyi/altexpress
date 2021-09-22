# ALTEXPRESS Backend Engine

! Attention ! The engine is in development. Functionality can be changed.

## Get started

1. Create a controller: 

``` ts
import { Request, Response, Controller, Get, Post, Put, Delete } from "@altcrm/altexpress";

@Controller("/clients")
export class ClientController {

    @Get("/:id")
    public async get(req: Request, res: Response): Promise<any> {
        const client = await service.findById(req.params.id);
        return { client };
    }
}
```

2. Create a module:

``` ts
import { Module } from "@altcrm/altexpress";

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

### Returning Method Result

1. Simple. Just return a body (http status is `200` by default):

``` ts
import { Request, Response, Controller, Post } from "@altcrm/altexpress";

@Controller("/clients")
export class ClientController {

    @Post("/")
    public async create(req: Request, res: Response): Promise<any> {
        const client = await service.create(req.body.dto);
        return { client };
    }
}
```

2. Custom status and body. Return `HttpResponse` object:

``` ts
import { Request, Response, Controller, Post, HttpResponse } from "@altcrm/altexpress";

@Controller("/clients")
export class ClientController {

    @Post("/")
    public async create(req: Request, res: Response): Promise<any> {
        const client = await service.create(req.body.dto);
        return new HttpResponse(201, { client });

        // or
        // return HttpResponse.successCreated({ client });
    }
}
```

3. Error handling:

``` ts
import { Request, Response, Controller, Post, HttpResponse, HttpException } from "@altcrm/altexpress";

@Controller("/clients")
export class ClientController {

    @Post("/")
    public async create(req: Request, res: Response): Promise<any> {
        try {
            // ...
        } catch (e: any) {
            return HttpResponse.error(e);

            // or
            // const err = new HttpException(400, e.message);
            // return HttpResponse.error(err);
        }
    }
}
```

4. Error handling by engine. Application will catch and handle exceptions:

``` ts
import { Request, Response, Controller, Post, HttpResponse, HttpException } from "@altcrm/altexpress";

@Controller("/clients")
export class ClientController {

    @Post("/")
    public async create(req: Request, res: Response): Promise<any> {
        // ...
        throw new HttpException(403, "Forbidden");

        // or
        // throw new Error("Custom error.");
    }
}
```

### API Versioning

1. Create controllers and modules for your business logic:

``` ts
@Controller("/clients")
export class ClientControllerV1 {

    @Get("/:id")
    public async get(req: Request, res: Response): Promise<any> {
        // ...
    }
}

@Controller("/clients")
export class ClientControllerV2 {

    @Get("/:id")
    public async get(req: Request, res: Response): Promise<any> {
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
    public async get(req: Request, res: Response): Promise<any> {
        // ...
    }
}
```

