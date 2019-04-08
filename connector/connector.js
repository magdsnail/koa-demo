'use strict'

class Connector {
    constructor(opt) {
        this.options = opt;
    }

    connect() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    close() {
        
    }
}

module.exports = Connector;