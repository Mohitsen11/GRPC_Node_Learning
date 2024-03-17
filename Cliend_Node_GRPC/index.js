const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');

var packageDefinition = protoLoader.loadSync('./todo.proto', 
                    {   keepCase: true,
                        longs: String,
                        enums: String,
                        defaults: true,
                        oneofs: true
                    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var todoService = protoDescriptor.TodoService;

const app = express();

const client = new todoService('localhost:50051', grpc.credentials.createInsecure());

// app.get('/:id', (req, res) => {
//     client.GetTodo({id: req.params.id} , (err, todo) => {
//         if(!err){
//             res.json(todo);
//         } else {
//             console.log(err);
//             res.status(500).send('Error occurred while fetching the todo');
//         }
//     })
// });

app.get('/todos', (req, res) => {
    client.ListTodo({} , (err, todos) => {
        if(!err){
            console.log(todos);
            res.json(todos);
        } else {
            console.log(err);
            res.status(500).send('Error occurred while fetching the todos');
        }
    })
});

// client.ListTodo({}, (err, todos) => {
//     if(!err){
//         console.log(todos);
//         client.CreateTodo({id: 6, title: 'todo6', content: 'Content of todo6'}, (err, todo) => {
//             if(!err){
//                 client.ListTodo({}, (err, todos) => {
//                     if(!err){
//                         console.log('After creating one more todo\n');
//                         console.log(todos);
//                     } else {
//                         console.log(err);
//                     }
//                 })
//             }
//         })
//     } else {
//         console.log(err);
//     }
// });

app.listen(6000, () => {
    console.log('Server is running at PORT:6000');
});

