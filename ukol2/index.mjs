import fsProm from 'fs/promises';

/**
 * Loads instructions where file names are, checks if input file is present,
 * loads content from input file and stores it in output file. (If output file's content is not empty, it is overwritten.)
 * If not successful, throws error to a console.
 * @returns {Promise<void>}
 */
async function copyFileContents() {
    try {
        // load instructions file
        const instructions = await fsProm.readFile('instructions.txt', 'utf-8');
        const [inputFileName, outputFileName] = instructions.split(' ');

        // check if input file exists
        try {
            await fsProm.access(inputFileName);
        } catch (error) {
            throw new Error(`Source file '${inputFileName}' does not exist.`);
        }

        // load and write the content from input to output file
        const fileContent = await fsProm.readFile(inputFileName, 'utf-8');
        await fsProm.writeFile(outputFileName, fileContent);

        console.log(`Content was successfully written to '${outputFileName}'.`);
    } catch (error) {
        // error console interaction
        console.error('Error:', error.message);
    }
}

copyFileContents();
