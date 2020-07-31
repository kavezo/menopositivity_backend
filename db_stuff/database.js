const uuidv1 = require('uuid/v1');
var firebase = require("firebase");

class Database {
    constructor() {
        this.authenticate();
    }

    authenticate() {
        // replace this function with something real
        this.authPromise = new Promise((resolve, reject) => {
            firebase.initializeApp({
                apiKey: "AIzaSyA9q9NF0IFiWHyGMF_O5w_M6dUBiFHYfFE",
                authDomain: "treehacks2020-66c34.firebaseapp.com",
                databaseURL: "https://treehacks2020-66c34.firebaseio.com",
                projectId: "treehacks2020-66c34",
                storageBucket: "treehacks2020-66c34.appspot.com",
                messagingSenderId: "52745561060",
                appId: "1:52745561060:web:7fbd0e67c89f819d029df1",
                measurementId: "G-JG554M9YMC"
            });
            firebase.auth().signInWithEmailAndPassword('diane@email.com', 'diane1').then(user=>{
                resolve();
            }).catch(function(error){
                console.log(error);
                reject();
            })
            this.db = firebase.firestore();
        })
    }

    addDatapoint(type, time, note) {
        if (!this.authPromise) {
            this.authenticate();
        }

        this.authPromise.then(() => {
            let uid = firebase.auth().currentUser.uid;
            let newDatapoint = {type: type, ts: time, note: note, user: uid};

            let docRef = this.db.collection('datapoints').doc(uuidv1());
            docRef.set(newDatapoint);
        }).catch(error =>
            console.log(error)
        )
    }

    addSleep(day, duration) {
        let uid = firebase.auth().currentUser.uid;
        let newSleep = {ts: day, hoursSlept: duration, user: uid};

        let docRef = this.db.collection('sleepdata').doc(uuidv1());
        docRef.set(newSleep);
    }

    getUserData() {
        if (!this.authPromise) {
            this.authenticate();
        }

        var yesterday = new Date();
        yesterday.setDate(12);
        var tomorrow = new Date();
        tomorrow.setDate(18);

        this.authPromise.then(() => {
            let uid = firebase.auth().currentUser.uid;
            let dataref = this.db.collection('datapoints');
            let query = dataref.where('user', '==', uid)
            query = query.where('ts', '<=', tomorrow)
            query = query.where('ts', '>=', yesterday)
            query.get().then(snapshot => {
                if (snapshot.empty) {
                console.log('No matching documents.');
                return;
                }  

                snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        }).catch(error =>
            console.log(error)
        )
    }
}
exports.Database = Database;