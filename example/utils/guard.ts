export abstract class Guard {
    public static Auth = (req: Request, res: Response, next: Function): void => {
        // TODO: check auth token
        next();
    };
}
