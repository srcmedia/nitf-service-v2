import { NITFService } from './NITFService';

let nitfService = new NITFService(process.argv);
/*
process.on('SIGINT', nitfService.shutdown);
process.on('SIGTERM', nitfService.shutdown);
*/
nitfService.start();