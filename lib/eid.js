import Fs from 'fs';


export default class Eid {

    constructor(file) {
        this.file = file;
    }

    read() {
        try {
            return Fs.readFileSync(this.file, { encoding: 'utf8' });
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
    }

    write(data) {
        Fs.writeFileSync(this.file, data, { encoding: 'utf8' });
    }
}