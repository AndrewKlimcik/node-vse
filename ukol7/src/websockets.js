import {WebSocketServer} from 'ws';
import ejs from 'ejs';
import {db, getAllTodos, getTodoById} from './db.js';

const connections = new Map();

export const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({server});

    wss.on('connection', (socket) => {
        connections.set(socket, {});

        socket.on('message', (message) => {
            const {type, todoId} = JSON.parse(message);
            if (type === 'viewingTodo') {
                connections.get(socket).viewingTodoId = todoId;
            }
        });

        socket.on('close', () => {
            connections.delete(socket);
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
export const sendTodoDetailsToConnections = async (todoId) => {
    const todoDetails = await ejs.renderFile('views/todo.ejs', {
        todo: await getTodoById(todoId),
        // translating priroty
        translatePriority: (priority) => {
            switch (priority) {
                case 'low':
                    return 'nízká';
                case 'normal':
                    return 'normální';
                case 'high':
                    return 'vysoká';
                default:
                    return 'neznámá';
            }
        }
    });

    connections.forEach((data, connection) => {
        if (data.viewingTodoId === todoId.toString()) {
            // WebSocket.OPEN same as 1
            if (connection.readyState === 1) {
                connection.send(JSON.stringify({
                    type: 'todoDetails',
                    html: todoDetails,
                }));
            }
        }
    });
};

