// @flow
export interface ILanguage {
    name: string;
    color: string;
}

export default class Language implements ILanguage {
    name: string;
    color: string;
    contributors: IUser[];

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }    
}
