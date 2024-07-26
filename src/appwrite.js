import { Client, Account, Avatars, Databases, Teams, Storage, AppwriteException } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('669cbafc001a06e0c089');


const avatars = new Avatars(client);
const databases = new Databases(client);
const roles = new Teams(client);
const storage = new Storage(client);

export const getUserData = async () => {
    try {
        const account = new Account(client);
        return account.get();
    } catch (error) {
        if (error instanceof AppwriteException) {
            throw new Error(error.message);
        } else {
            throw error;
        }
    }
}
export const login = async (email, password) => {
    try {
        const account = new Account(client);
        return account.createEmailPasswordSession(email, password);
    } catch (error) {
        if (error instanceof AppwriteException) {
            throw new Error(error.message);
        } else {
            throw error;
        }
    }
}
export const logout = async (email, password) => {
    try {
        const account = new Account(client);
        return account.deleteSession('current');
    } catch (error) {
        if (error instanceof AppwriteException) {
            throw new Error(error.message);
        } else {
            throw error;
        }
    }
}

export { client, avatars, databases, roles, storage };