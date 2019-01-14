require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyPraser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT;

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
            error: 'id is invalid'
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
                    error: 'todo record not found'
                }
            );
        }
        // if todo - send it back
        res.status(200).send({
            status: 'SUCCESS',
            todo
        });

        // error
        // 400 - and send empty body back
    }).catch((e) => {
        res.status(400).send({
            status: 'FAILED',
            error: e
        })
    })

});

app.delete('/todos/:id', (req, res) => {
    //get the id
    var id = req.params.id;

    // validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            status: 'FAILED',
            error: 'id is invalid'
        });
    }

    //remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        // success
        if (!todo) {
            //  if no doc, send 404
           return res.status(404).send({
                status: 'FAILED',
                error: 'todo record not found'
            })
        }

        // if doc return with 200
        res.status(200).send({
            status: 'SUCCESS',
            todo
        })
    })
        //error, 400
        .catch((e) => {
            res.status(400).send({
                status: 'FAILED',
                error: e
            })
        })
})

app.patch('/todos/:id', (req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

        // validate the id -> not valid? return 404
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({
                status: 'FAILED',
                error: 'id is invalid'
            });
        }

        if(_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id, {
            $set: body
        },
        {
            new: true
        }).then((todo)=>{
            if(!todo) {
                return res.status(404).send({
                    status: 'FAILED',
                    error: 'todo record not found'
                }) 
            }

            res.send({
                status: 'SUCCESS',
                todo
            })
        }).catch((e)=>{
            res.status(400).send({
                status: 'FAILED',
                error: e
            })
        })

})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports = {
    app
}