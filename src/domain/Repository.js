// @flow
import IUser from './User'
import ILanguage from './Language'

export interface IRepository {
    id: string;
    name: string;
    description: string;
    forkCount: number;
    primaryLanguage: ILanguage;
    languages: ILanguage[];
    contributors: IUser[];
}

export default class Repository implements IRepository {
    id: string;
    name: string;
    description: string;
    primaryLanguage: ILanguage;
    languages: ILanguage[];
    contributors: IUser[];

    constructor(
        id: string, 
        name: string, 
        description: string, 
        forkCount: number=undefined, 
        primaryLanguage:ILanguage=undefined, 
        languages:ILanguage=[], 
        contributors: IUser[]=[]       
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.forkCount = forkCount;
        this.primaryLanguage = primaryLanguage;
        this.languages = languages;
        this.contributors = contributors;
    }    
}
