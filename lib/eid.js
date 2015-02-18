import Fs from 'fs';
import Dbrickashaw from 'dbrickashaw';


const log = Dbrickashaw.getLogger('dbrickashaw');

export default class Eid {

    constructor(file) {
        this.file = file;
    }

    read() {
        try {
            return Fs.readFileSync(this.file, { encoding: 'utf8' });
        } catch (err) {
            log.error(['eid'], err.stack);
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
    }

    write(data) {
        try {
            Fs.writeFileSync(this.file, data, {encoding: 'utf8'});
        } catch (err) {
            log.error(['eid'], err.stack);
        }
    }
}