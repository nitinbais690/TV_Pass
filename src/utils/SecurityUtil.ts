import CryptoJS from 'crypto-js';

const SECRET = [42, 32, 71, 62, 13, 75, 62, 13, 62, 50, 73];

/**
 * @param {string} encrypted - The encrypted string which is to be decrypted
 *
 * @return {boolean} - Decrypted string
 * @ignore
 */
const decrypt = (encrypted: string): string => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, deobfuscate(SECRET));
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.log(`Error decrypting ${encrypted}`, e);
        return encrypted;
    }
};
/**
 * Takes an array of char codes and performs a bitwise
 * XOR.
 *
 * @param {array} input Array of char codes
 * @return string
 * @ignore
 */
const deobfuscate = (input: number[]): string => {
    let result = '';
    for (const val of input) {
        const a = val;
        // tslint:disable-next-line:no-bitwise
        const b = a ^ 0x7e;
        result = result + String.fromCharCode(b);
    }

    return result;
};

export default decrypt;
