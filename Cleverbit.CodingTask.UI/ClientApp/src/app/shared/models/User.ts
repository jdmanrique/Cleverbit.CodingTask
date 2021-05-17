
export class AuthResult {
    isAuthenticated: boolean;
    authErrorMessage: string;
    userData: User;
}

export class User {
    id: number;
    token: string;
    userName: string;
}