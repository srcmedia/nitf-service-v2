import * as dateformat from 'dateformat';
import * as fs from 'fs';

/**
 * A simple factory class to construct and maintain a list of loggers
 */
export class LoggerFactory {
    private static instances:Logger[] = [];

    static create(name: string): Logger {
        let inst: Logger;

        if (LoggerFactory.instances[name] === undefined) {
            inst = new Logger(name);
            LoggerFactory.instances[name] = inst;
        } else {
            inst = LoggerFactory.instances[name];
        }
        return inst;
    }
}

/**
 * A simple logging class, intentionally private to force devs to use factory method instead
 */
class Logger {
    private static LOG_PATH: string = "./logs";

    /**
     * Simple constructor
     * @param name name of the class
     */
    constructor(
        private name: string
    ) {
        // constructor checks if the specified log directory exists, if not it creates it.
        if (!fs.existsSync(Logger.LOG_PATH)) fs.mkdirSync(Logger.LOG_PATH);
    }

    /**
     * Simple logging method
     * @param message First line of log message, should be a simple string
     * @param obj Optional object, passed into JSON.stringify
     */
    public writeToLog(message: String, obj?: any) {
        let timestamp: string = '[' + dateformat(new Date(), 'HH:MM:ss.l') + ']';

        if (obj) {
            message += '\n\tLogged Object: ' + JSON.stringify(obj);
        }

        message = this.name + ': ' + message;

        fs.appendFile(
            Logger.LOG_PATH + '/nitf-service-' + dateformat(new Date(), 'yyyy-mm-dd') + '.log',
            timestamp +': ' + message + '\n',
            (err: NodeJS.ErrnoException) => {
                if (err) console.log(err);
            }
        );
    }
}