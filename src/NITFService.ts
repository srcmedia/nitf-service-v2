import * as exp from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as dateformat from 'dateformat';

export class NITFService {
    private static SERVICE_NAME: string = "NITF Service v2";
    private static LOG_PATH: string = "./logs";
    private static OUT_PATH: string = "./output";
    private static DEFAULT_HOST: string = '0.0.0.0';
    private static DEFAULT_PORT: number = 3000;

    private express: exp.Application;
    private hostOverride: string = null;
    private portOverride: number = null;

    constructor(args: string[]) {
        
        if (args && args[2]) {
            this.hostOverride = args[2];
        }
        if (args && args[3]) {
            this.portOverride = parseInt(args[3]);
        }

        this.express = exp();
        this.express.use(bodyParser.raw({
            inflate: true,
            type: 'application/xml'
        }));
        this.directorySetup();
        this.bindRoutes();
    }

    // Separate start function that logs accordingly.
    public start(): void {
        this.writeToLog('Starting ' + NITFService.SERVICE_NAME + ' on ' + this.getHost() + ':' + this.getPort());
        this.express.listen(this.getPort(), this.getHost(), () => {
            this.writeToLog(NITFService.SERVICE_NAME + ' Started!');
        });
    }
    
    // Wrapper method for binding the routes to the server instance
    private bindRoutes(): void {
        let router = exp.Router();

        router.post("/nitf/:fileName", (req: exp.Request, res: exp.Response) => {

            fs.writeFile(NITFService.OUT_PATH + '/'+ req.params.fileName , req.body, (err:  NodeJS.ErrnoException) => {

                if (err) this.writeToLog('Error on ' + req.params.fileName, err);

                this.writeToLog(req.params.fileName + ' recieved.');
            });

        });

        this.express.use('/',router);        
    }

    // Part of setup, makes required output and logging directories if none exist
    private directorySetup(): void {
        if (!fs.existsSync(NITFService.LOG_PATH)) fs.mkdirSync(NITFService.LOG_PATH);
        if (!fs.existsSync(NITFService.OUT_PATH)) fs.mkdirSync(NITFService.OUT_PATH);
    }

    // Simple getter for the host addr, will use arg host if defined
    private getHost(): string {
        return this.hostOverride ? this.hostOverride : NITFService.DEFAULT_HOST;
    }

    // Simple getter for the port, will return arg port if defined
    private getPort(): number {
        return this.portOverride ? this.portOverride : NITFService.DEFAULT_PORT;
    }

    /**
     * Simple logging method
     * @param message First line of log message, should be a simple string
     * @param obj Optional object, passed into JSON.stringify
     */
    private writeToLog(message: String, obj?: any) {
        let timestamp: string = '[' + dateformat(new Date(), 'HH:MM:ss.l') + ']';

        if (obj) {
            message += '\n\tLogged Object: ' + JSON.stringify(obj);
        }

        fs.appendFile(
            NITFService.LOG_PATH + '/nitf-service-' + dateformat(new Date(), 'yyyy-mm-dd') + '.log',
            timestamp +': ' + message + '\n',
            (err: NodeJS.ErrnoException) => {
                if (err) console.log(err);
            }
        );
    }
}