import fsProm from 'fs/promises';

async function createFiles() {
    try {
        // load instructions.txt file
        const instructions = await fsProm.readFile('instructions.txt', 'utf-8');
        const parsedInt = parseInt(instructions)

        // array for promises
        const promises = [];

        for (let i = 0; i < parsedInt; i++) {
            promises.push(fsProm.writeFile(`${i}.txt`, `Soubor ${i}`));
        }

        // resolving all at once
        await Promise.all(promises);

        console.log('Všechny soubory úspěšně vytvořeny.');
    } catch (e) {
        console.error('Chyba při vytváření souborů:', e);
    }
}

createFiles();