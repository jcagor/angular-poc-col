export interface Authetication {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export interface idTypes {
    value: string;
    viewValue: string;
}

export interface RestrictiveLists {
    Matches: boolean,
    QueryNumber: number,
}
