const webpush = require('web-push');
const colors = require('colors/safe');
const promptly = require('promptly');

process.stdout.write(colors.green(`
       ...
     /\`   \`\\
    /       \\
   |\\~~~~~~~/|
   | \\=====/ |   Example to send push message 
   | /\`...'\\ |    using a subscription JSON
   |/_______\\|
\n`));

async function run() {

    // Ask for public & private key
    const publicKey = await promptly.prompt(colors.magenta('Please specify your public key:'));
    const privateKey = await promptly.prompt(colors.magenta('Please specify your private key:'));

    // Ask for JSON data
    const json = await promptly.prompt(colors.magenta('Please copy JSON from client:'));

    process.stdout.write('\n');

    try {
        webpush.setVapidDetails(
            'mailto:example@example.com',
            publicKey,
            privateKey
        );

        // Send push message
        const result = await webpush.sendNotification(JSON.parse(json), 'This is my great push message');

        process.stdout.write(colors.green('Push message send!'));
    } catch (e) {
        process.stdout.write(colors.red(`Failed to send push notification: ${e}\n`));
    }
}

run();

