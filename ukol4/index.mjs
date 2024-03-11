import http from 'http';
import fsProm from 'fs/promises';

const PORT = 3000;
const FILENAME = 'counter.txt';

async function getCurrentNumber() {
    try {
        const data = await fsProm.readFile(FILENAME, 'utf8');
        return parseInt(data, 10);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fsProm.writeFile(FILENAME, '0');
            return 0;
        } else {
            throw error;
        }
    }
}

async function updateNumber(updateFn) {
    const currentNumber = await getCurrentNumber();
    const updatedNumber = updateFn(currentNumber);
    await fsProm.writeFile(FILENAME, updatedNumber.toString());
}

const server = http.createServer(async (req, res) => {
    if (req.url === '/increase') {
        await updateNumber(number => number + 1);
        res.end('OK');
    } else if (req.url === '/decrease') {
        await updateNumber(number => number - 1);
        res.end('OK');
    } else if (req.url === '/read') {
        const currentNumber = await getCurrentNumber();
        res.end(currentNumber.toString());
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
