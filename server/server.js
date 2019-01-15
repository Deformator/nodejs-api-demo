require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyPraser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyPraser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos: todos })
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/12345
app.get('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    // validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            status: 'FAILED',
            error: 'id is invalid'
        });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
            $set: body
        },
        {
            new: true
        }).then((todo) => {
            if (!todo) {
                return res.status(404).send({
                    status: 'FAILED',
                    error: 'todo record not found'
                })
            }

            res.send({
                status: 'SUCCESS',
                todo
            })
        }).catch((e) => {
            res.status(400).send({
                status: 'FAILED',
                error: e
            })
        })
})

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    })
        .then((token) => {
            res.header('x-auth', token).send(user)
        })
        .catch((e) => {
            res.status(400).send(e);
        })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);

        })
    }).catch((e) => {
        res.status(400).send({
            status: 'FAILED',
            error: e
        });
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports = {
    app
}