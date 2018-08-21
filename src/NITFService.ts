import * as exp from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import { LoggerFactory } from './util/LoggerFactory';

export class NITFService {
    private static OUT_PATH: string = "./output";
    private static DEFAULT_HOST: string = '0.0.0.0';
    private static DEFAULT_PORT: number = 3000;

    private LOGGER = LoggerFactory.create('NITFService');
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
        // without this, express craps the bed when it gets XML
        this.express.use(bodyParser.raw({
            inflate: true,
            type: 'application/xml'
        }));
        this.directorySetup();
        this.bindRoutes();
    }

    // Separate start function that logs accordingly.
    public start(): void {
        this.LOGGER.writeToLog('Starting on ' + this.getHost() + ':' + this.getPort());
        this.express.listen(this.getPort(), this.getHost(), () => {
            this.LOGGER.writeToLog('Started!');
        });
    }
    
    // Wrapper method for binding the routes to the server instance
    private bindRoutes(): void {
        let router = exp.Router();

        router.post("/nitf/:fileName", (req: exp.Request, res: exp.Response) => {

            fs.writeFile(NITFService.OUT_PATH + '/'+ req.params.fileName , req.body, (err:  NodeJS.ErrnoException) => {

                if (err) this.LOGGER.writeToLog('Error on ' + req.params.fileName, err);

                this.LOGGER.writeToLog(req.params.fileName + ' recieved.');
            });

        });

        this.express.use('/',router);        
    }

    // Part of setup, makes required output and logging directories if none exist
    private directorySetup(): void {
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
}
