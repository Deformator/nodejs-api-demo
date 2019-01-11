const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// var id = '5c38f68c2277c0d4b5edea2d';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

//User.findById

User.findById('5c38fde3d9be066bed4d169c').then((user) => {
    if (!user) {
        return console.log('User was not found');
    }
    console.log(JSON.stringify(user, undefined, 2));

}).catch((e) => {
    console.log(e.message);
})


//no user, user was found, any errors