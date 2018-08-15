import * as NITF from './NITFService';

let nitfService = new NITF.NITFService(process.argv);
/*
process.on('SIGINT', nitfService.shutdown);
process.on('SIGTERM', nitfService.shutdown);
*/
nitfService.start();