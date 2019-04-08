'use strict'

const MongoDb = require('mongodb');

const Connector = require('./connector');

class MongoConnector extends Connector {
    constructor(opt) {
        super(opt)
        this.client = null;
        this.db = null;
    }

    connect () {
        const self = this;
        return new Promise((resolve, reject) => {
            MongoDb.MongoClient.connect(self.options.url, {
                ignoreUndefined: true,
                useNewUrlParser: true
            }, (err, client) => {
                if (err) return reject(err);
                self.client = client;
                self.db = client.db(this.options.base);//db;
                resolve();
            });
        });
    }

    count (collection, where) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find(where).count((err, num) => {
                if (err) return reject(err);
                return resolve(num); 
            });
        });
    }

    aggregate (collection, query) {
        const self = this;
        return new Promise((resolve, reject) => {
            const aggregateWhere = [
                { $match: query.match },
                { $group: query.group }
            ];
            if (query.sort) {
                aggregateWhere.push({ $sort: query.sort});
            }
            self.db.collection(collection).aggregate(aggregateWhere).toArray((err, results) => {
                if (err) return reject(err);
                return resolve(results);
            })
        });
    }

    findOne (collection, query, opts) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.db.collection(collection).findOne(query.where, opts, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    }

    insert (collection, data, opts) {
        return new Promise((resolve, reject) => {
            if (Array.isArray(data)) {
                this.db.collection(collection).insertMany(data, opts, (err, results) => {
                    if (err) return reject(err);
                    if (results.insertedCount > 0) {
                        resolve(results.ops);
                    } else {
                        reject(new Error('insert failed.'));
                    }
                });
            } else {
                this.db.collection(collection).insertOne(data, opts, (err, results) => {
                    if (err) return reject(err);
                    if (results.insertedCount == 1) {
                        resolve(results.ops[0]);
                    } else {
                        reject(new Error('insert failed.'));
                    }
                });    
            }
        });
    }

    find (collection, query) {
        return new Promise((resolve, reject) => {
            if (query === undefined) {
                query = {
                    where: {}
                };
            }
            let cursor = this.db.collection(collection).find(query.where);
            if (query.skip) {
                cursor = cursor.skip(query.skip);
            }
            if (query.sort) {
                cursor = cursor.sort(query.sort);
            }
            if (query.limit) {
                cursor = cursor.limit(query.limit);
            }
            cursor.toArray((err, results) => {
                if (err) return reject(new Error('find failed - ' + err.message));
                return resolve(results);
            });
            
        });
    }

    findWithCursor (collection, query) {
        return new Promise((resolve, reject) => {
            if (query === undefined) {
                query = {
                    where: {}
                };
            }
            let cursor = this.db.collection(collection).find(query.where);
            if (query.skip) {
                cursor = cursor.skip(query.skip);
            }
            if (query.sort) {
                cursor = cursor.sort(query.sort);
            }
            if (query.limit) {
                cursor = cursor.limit(query.limit);
            }
            if(query.batchSize) {
                cursor = cursor.limit(query.batchSize);
            }
            return resolve(cursor);
        });
    }

    bulkWrite(collection, data, opts){
        return new Promise((resolve, reject) => {
            this.db.collection(collection).bulkWrite(data, opts, (err, result) => {
                if(err) reject(err);
                resolve(result); 
            });
        });
    }

    findById (collection, id, opts) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOne({_id: id}, opts, (err, result) => {
                if (err) return reject(new Error('find failed - ' + err.message));
                resolve(result);
            });
        });      
    }

    findId (collection, query) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOne(query.where, {fields: {_id: 1}}, (err, result) => {
                if (err) return reject(new Error('find failed - ' + err.message));
                if (result) {
                    resolve(result._id);
                } else {
                    resolve(null);
                }
            });
        });
    }

    delete (collection, where) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).deleteMany(where, (err, results) => {
                if (err) return reject(new Error('delete failed - ' + err.message));
                resolve(results);
            });
        });
    }

    deletebyId (collection, id) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).deleteOne({_id: id}, (err, result) => {
                if (err) return reject(new Error('delete failed - ' + err.message));
                resolve(result);
            });
        });
    }

    deleteOne (collection, where) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).deleteOne(where, (err, result) => {
                if (err) return reject(new Error('delete failed - ' + err.message));
                resolve(result);
            });
        });
    }

    update (collection, where, data) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).updateMany(where, { $set: data }, {returnOriginal: false }, (err, result) => {
                if (err) return reject(new Error('update failed - ' + err.message));
                resolve(result.modifiedCount);
            });
        });
    }

    updateById (collection, id, data) {
       return new Promise((resolve, reject) => {
            this.db.collection(collection).findOneAndUpdate({_id: id}, {$set: data}, {returnOriginal: false }, (err, result) => {
                if (err) return reject(new Error('update failed - ' + err.message));
                if (result.ok == 1) {
                    resolve(result.value);
                } else {
                    resolve(null);
                }
            });
       });      
    }

    updateOne (collection, where, data) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOneAndUpdate(where, { $set: data }, {returnOriginal: false }, (err, result) => {
                if (err) return reject(new Error('update failed - ' + err.message));
                if (result.ok == 1) {
                    resolve(result.value);
                } else {
                    resolve(null);
                }
            });
       }); 
    }

    close() {
        this.client.close();
    }

}

module.exports = MongoConnector;