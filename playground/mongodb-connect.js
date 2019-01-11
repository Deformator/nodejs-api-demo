// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }

    console.log('Connected to MongoDb server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops));
    // })

    db.collection('Users').insertOne({
        name: 'Andrii',
        age: 33,
        location: 'Toronto'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert a user', err);
        }

        console.log(JSON.stringify(result.ops));

        //getting timestamp from Object id (when object was created)
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));

    })


    client.close();
})