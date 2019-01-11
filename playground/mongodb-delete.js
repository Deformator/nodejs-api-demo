// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDb server');
    const db = client.db('TodoApp');

    //// deleteMany

    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });

    //// deleteOne

    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result.result);
    // })

    //// findOneAndDelete

    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result);
    // })


    //trainings 

    // db.collection('Users').deleteMany({name: 'Andrii'}).then((result)=>{
    //     console.log(result.result);
    // }, (err)=>{
    //     console.log(`Can't delete users with`, err);
    // })

    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5c38b9c8896a96de3185bdea')}).then((result)=>{
    //     console.log(`User ${JSON.stringify(result.value, undefined, 2)} was deleted`);
    // }, (err)=>{
    //     console.log(`Wasn't able to delete the user`, err)
    // })

    // client.close();
})