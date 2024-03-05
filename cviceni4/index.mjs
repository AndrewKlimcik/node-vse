import fs from 'fs';
import http from 'http';

const server = http.createServer((req, res) => {
    fs.readFile('index.html', (err, data) => {
        res.write(data);
        res.end();
    });
});

server.listen(3000);
console.log('Listening on port 3000...');
