const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();

app.use(express.json());

const apiKey = '1234';
const users = [];

app.get('/', (req, res) => {
    res.send('The server is running...');
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
});

app.post('/api/users', (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = {
        id: uuidv4(),
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        isAdmin: req.body.isAdmin,
    };
    users.push(user);
    res.send(user);
});

app.put(`/api/users/:id`, (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    user.firstName = req.body.firstName;
    res.send(user);

});

app.delete(`/api/users/:id`, (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    const index = users.indexOf(user);
    users.splice(index, 1);

    res.send(user);
});

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        age: Joi.number().min(0).required(),
        isAdmin: Joi.boolean().required(),
    });

    return schema.validate(user);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));