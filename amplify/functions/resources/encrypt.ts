import bcrypt from 'bcryptjs';

export const encryptString = async (value:string, SALT_ROUNDS:number = 10) => {
    return await bcrypt.hash(value, SALT_ROUNDS);
}

export const compareString = async (password:string, hashPassword:string) => {
    return await bcrypt.compare(password, hashPassword);
}