var express = require('express');
var bodyPraser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

app.use(bodyPraser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos: todos })
    }, (e) => {
        res.status(400).send(e);
    })

})

// GET /todos/12345
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    // res.send(req.params);

    // Validate id using isValid
    //404 - send back empty send
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            status: 'FAILED',
            body: {
                error: 'id is invalid'
            }
        });
    }

    // findById
    Todo.findById(id).then((todo) => {
        // success
        if (!todo) {
            // if no todo - send 404 with an empty body
            return res.status(404).send(
                {
                    status: 'FAILED',
                    body: {
                        error: 'todo record not found'
                    }
                }
            );
        }
        // if todo - send it back
        res.status(200).send({
            status: 'SUCCESS',
            body: {
                todo
            }
        });

        // error
        // 400 - and send empty body back
    }).catch((e) => {
        res.status(400).send({
            status: 'FAILED',
            body: {
                error: e
            }
        })
    })

})

app.listen(3000, () => {
    console.log('Started on port 3000');
})

module.exports = {
    app
}