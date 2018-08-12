// @flow
export interface IUser {
    id: string;
    name: string;
    avatar: string;
    contributions: number;
}

export default class User implements IUser {
    id: string;
    name: string;
    avatar: string;
    contributions: number;

    constructor(id: string, name: string, avatar: string, contributions: number) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.contributions = contributions;
    }    
}
