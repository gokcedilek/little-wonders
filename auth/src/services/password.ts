// import * as bcrypt from 'bcrypt';

// export class Password {
//   static async toHash(password: string) {
//     const salt = await bcrypt.genSalt();
//     const hash = await bcrypt.hash(password, salt);
//     console.log(`salt: ${salt}`);
//     console.log(`hash: ${hash}`);
//     return hash;
//   }

//   static async compare(storedPassword: string, suppliedPassword: string) {
//     return await bcrypt.compare(suppliedPassword, storedPassword);
//   }
// }

import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

//turn the callback-based scrypt to a promise-based implementation (so we can use async await)
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    //storedPassword: output of toHash
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
