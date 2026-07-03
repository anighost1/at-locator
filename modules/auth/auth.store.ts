import bcrypt from 'bcrypt';

export const users: any[] = [
    {
        email: "test@test.com",
        password: bcrypt.hashSync("123456", 10)
    }
];