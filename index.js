const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// const todosProto = grpc.load('todo.proto');

var packageDefinition = protoLoader.loadSync('./todo.proto', 
                    {   keepCase: true,
                        longs: String,
                        enums: String,
                        defaults: true,
                        oneofs: true
                    });

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

var todoService = protoDescriptor.TodoService;

console.log(todoService);

const server = new grpc.Server();

// for the time being I am not making connection with DB
// using the todos (array of objects) for the demo

const todos = [
    {
        id: '1', title: 'todo1', content: 'Content of todo1'
    },
    {
        id: '2', title: 'todo2', content: 'Content of todo2'
    },
];

server.addService(todoService.service, {
    createTodo: (call, callback) => {
        let incomingNewTodo = call.request;
        todos.push(incomingNewTodo);
        console.log(todos);
        callback(null, incomingNewTodo);
    },
    getTodo: (call, callback) => {
        let incomingRequestTodo = call.request;
        let todoId = incomingRequestTodo.id;
        const response = todos.filter((todo) => todo.id == todoId);
        console.log(response);
        if(response.length > 0){
            callback(null, response[0]);
        } else {
            callback({
                message: 'Todo not found'
            }, null);
        }
    },
    listTodo: (call, callback) => {
        callback(null, {
            todos: todos
        });
    }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server started');
    // server.start();
});

