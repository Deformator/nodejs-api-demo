const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//     console.log(result);
// })


// Todo.findOneAndRemove({_id: '5c3ca472d9be066bed4d298b'}).then((todo)=> {

// });


// Todo.findByIdAndRemove('5c3ca472d9be066bed4d298b').then((todo)=> {
//     console.log(todo);
// })