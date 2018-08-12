// @flow
export interface ILocale {
    id: string;
    name: string;
    code: string;
}

export default class Locale implements ILocale {
    id: string;
    name: string;
    code: string;

    constructor(id: string, name: string, code: string) {
        this.id = id;
        this.name = name;
        this.code = code;
    }
}
