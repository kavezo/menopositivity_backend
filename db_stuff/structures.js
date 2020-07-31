let DEFAULT_TYPES = [
    // Symptoms
    "Hot flash",
    "Insomnia",
    "Dizziness",
    "Joint pain",
    "Anxiety",
    "Depression",
    // Triggers
    "Stress",
    "Mood",
    "Caffeine",
    "Smoking",
    "Warm environment",
    "Alcohol",
    "Sugar",
    "Spicy food",
    "Tight clothing",
    "Dehydration",
    "Bending over"
]

class User {
    constructor(docRef, admin) {
        this.docRef = docRef;
        this.admin = admin;
    }

    initialize() {
        this.docRef.set({
            types: DEFAULT_TYPES
        })

        this.dayRef = this.docRef.collection('days');
        this.dayRef.doc(this.dateString(new Date())).set({events: []});
    }

    dateString(date) {
        let month = date.getMonth()+1;
        if (month<10) month = "0"+month.toString()
        else month = month.toString()

        let day = date.getDate();
        if (day<10) day = "0"+day.toString()
        else day = day.toString()

        return date.getFullYear()+""+month+day;
    }

    addTrigger(trigger) {
        this.docRef.get()
        .then(doc => {
            if (doc.exists) {
                this.docRef.update({
                    types: this.admin.firestore.FieldValue.arrayUnion(trigger)
                });
            }
        })
        .catch(err => {
            console.log('addTrigger: error getting document', err);
        });
    }

    // takes a JS Date object
    addDay(date) {
        let dayDocRef = this.dayRef.doc(this.dateString(date));
        dayDocRef.get()
        .then(doc => {
            if (!doc.exists) {
                dayDocRef.set({events: []});
            }
        })
        .catch(err => {
            console.log('addDay: error getting document', err);
        });
    }

    // int, Date, string
    addEvent(type, time, note) {
        let newEvent = {type: type, ts: time, note: note};

        let dayDocRef = this.dayRef.doc(this.dateString(time));
        dayDocRef.get()
        .then(doc => {
            if (!doc.exists) {
                dayDocRef.set({events: [newEvent]});
            }
            else {
                dayDocRef.update({
                    events: this.admin.firestore.FieldValue.arrayUnion(newEvent)
                });
            }
        })
        .catch(err => {
            console.log('addEvent: error getting document', err);
        });
    }

    getTriggers(callback) {
        this.docRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('getTriggers: no such document');
                callback(null);
            }
            else {
                callback(doc.data().types.slice(6));
            }
        })
        .catch(err => {
            console.log('getTriggers: error getting document', err);
            callback(null);
        });
    }

    getDayEvents(date, callback) {
        let dayDocRef = this.dayRef.doc(this.dateString(date));
        dayDocRef.get()
        .then(doc => {
            if (!doc.exists) {
                callback([]);
            }
            else {
                callback(doc.data().events);
            }
        })
        .catch(err => {
            console.log('addDay: error getting document', err);
            callback(null);
        });
    }
}

exports.User = User;