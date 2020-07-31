const uuidv1 = require('uuid/v1');
var firebase = require("firebase");

export class Database {
    constructor() {
        this.uid = firebase.auth().currentUser.uid;
        this.db = firebase.firestore();
    }

    checkLogin() {
        console.log(uid);
    }

    addDatapoint(type, time, note) {
        let newDatapoint = {type: type.toString(), ts: time, note: note, user: this.uid};

        let docRef = this.db.collection('datapoints').doc(uuidv1());
        docRef.set(newDatapoint);

        if (type>=6) {
            let dataref = this.db.collection('aggregate');
            let query = dataref.where('user', '==', this.uid).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    dataref.doc(uuidv1()).set({type: [1, 0]});
                }  
                else {
                    let data = snapshot[0];
                    if (!data[type]) {
                        data[type] = [1, 0];
                    }
                    else {
                        data[type][0] += 1;
                    }

                }
            })
            .catch(err => {
                console.log('addDatapoint: error getting documents', err);
                callback(null);
            });
        }
    }

    addSleep(day, duration) {
        let newSleep = {ts: day, hoursSlept: duration, user: this.uid};

        let docRef = this.db.collection('sleepdata').doc(uuidv1());
        docRef.set(newSleep);
    }

    aggregateData(type, score) {
        let dataref = this.db.collection('aggregate');
        type = type.toString();
        let query = dataref.where('user', '==', this.uid).get()
        .then(snapshot => {
            if (snapshot.empty) { // this should not happen, but if it does, welp, we just assume there's only one
                let newScores = new Object();
                newScores[type] = [1, score];
                dataref.doc(uuidv1()).set(newScores);
            }  
            else {
                let data = snapshot[0];
                if (!data[type]) { // this should also not happen, but we treat it as above
                    data[type] = [1, score];
                }
                else {
                    data[type][1] += score;
                }

            }
        })
        .catch(err => {
            console.log('aggregateData: error getting documents', err);
            callback(null);
        });
    }

    getSleep(callback) {
        let dataref = this.db.collection('sleepdata');
        let query = dataref.where('user', '==', this.uid).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('getSleep: no matching documents.');
                callback([]);
                return;
            }  

            callback(snapshot);
        })
        .catch(err => {
            console.log('getSleep: error getting documents', err);
            callback(null);
        });
    }

    getAllData(callback) {
        let dataref = this.db.collection('datapoints');
        let query = dataref.where('user', '==', this.uid).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('getUserData: no matching documents.');
                callback([]);
                return;
            }  

            callback(snapshot);
        })
        .catch(err => {
            console.log('getUserData: error getting documents', err);
            callback(null);
        });
    }

    getRangeData(start, stop, callback) {
        let dataref = this.db.collection('datapoints');
        let query = dataref.where('user', '==', this.uid).where('ts', '>=', start).where('ts', '<=', stop).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('getRangeData: no matching documents.');
                callback([]);
                return;
            }  

            callback(snapshot);
        })
        .catch(err => {
            console.log('getRangeData: error getting documents', err);
            callback(null);
        });
    }

    getAggregate(callback) {
        let dataref = this.db.collection('aggregate');
        let query = dataref.where('user', '==', this.uid).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('getAggregate: no matching documents.');
                callback([]);
                return;
            }  

            callback(snapshot);
        })
        .catch(err => {
            console.log('getAggregate: error getting documents', err);
            callback(null);
        });
    }
}