import {WebSocketServer} from 'ws';
import ejs from 'ejs';
import {db, getAllTodos, getTodoById} from './db.js';

const connections = new Map();

export const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({server});

    wss.on('connection', (socket) => {
        connections.set(socket, {});
        console.log('New connection', connections.size);

        socket.on('message', (message) => {
            const url = message.toString();
            const id = url.split('/').pop();
            console.log('connection on todo id', id);
            connections.set(socket, id);
        });

        socket.on('close', () => {
            connections.delete(socket);
            console.log('Close connection', connections.size);
        });
    });
};

/**
 * List of todos are updated for all clients
 * @returns {Promise<void>}
 */
export const sendTodoListToAllConnections = async () => {
    const todoList = await ejs.renderFile('views/_todos.ejs', {todos: await getAllTodos()});

    connections.forEach((_, connection) => {
        // WebSocket.OPEN same as 1
        if (connection.readyState === 1) {
            connection.send(JSON.stringify({
                type: 'todoList',
                html: todoList,
            }));
        }
    });
};

/**
 * Details of todo is updated for all clients
 * @param todoId
 * @returns {Promise<void>}
 */
export const sendtodoDetailsToConnections = async (todoId) => {
    const todoDetails = await ejs.renderFile('views/_todo.ejs', {
        todo: await getTodoById(todoId)
    });

    for (const [connection, connectionId] of connections) {
        console.log('connnectionId', connectionId);
        console.log('todoId', todoId);
        if (connectionId === todoId)
        connection.send(
            JSON.stringify({
                type: 'todoDetails',
                html: todoDetails,
        }));
    };
};

