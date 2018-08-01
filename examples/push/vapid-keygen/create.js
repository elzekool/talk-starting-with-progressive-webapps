/**
 * Simple Script to create valid VAPID keys
 *
 * @author Elze Kool <efrkool@live.nl>
 */

const webpush = require('web-push');
const colors = require('colors/safe');

process.stdout.write(colors.green(`
     .--------.
    / .------. \\
   / /        \\ \\
   | |        | |
  _| |________| |_
.' |_|        |_| '.
'._____ ____ _____.'
|     .'____'.     |
'.__.'.'    '.'.__.'   Example VAPID Key Generator
'.__  |      |  __.'    
|   '.'.____.'.'   |
'.____'.____.'____.'
'.________________.'
\n`));


const vapidKeys = webpush.generateVAPIDKeys();

process.stdout.write(colors.yellow('Your public key:\n'));
process.stdout.write(vapidKeys.publicKey + '\n\n');

process.stdout.write(colors.yellow('Your private key:\n'));
process.stdout.write(vapidKeys.privateKey + '\n\n');
