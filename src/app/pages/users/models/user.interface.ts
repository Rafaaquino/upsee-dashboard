export interface IUser {
    id: string;
    client_id: number;
    profile: Profile;
    company: string;
    role: string;
    iat: number;
    exp: number;
}

export interface Profile {
    address: Address;
    contacts: Contacts;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: any;
}

export interface Address {
    street: string;
    complement: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface Contacts {
    homePhone: string;
    mobilePhone: string;
    workPhone: string;
}
