import { Resource } from './resource';
import { Type } from './type';
import { Subtype } from './subtype';

export class DashboardData {
    resources: Resource[] = [];
    types: Type[] = [];
    subtypes: Subtype[] = [];

    constructor(data: Resource[], selectedTypeName: string | null) {
        let resources: Resource[] = [];
        let typeNames: string[] = [];
        let firstSubtypes: { [id: string]: string; } = {};
        let types: { [id: string]: Type; } = {};
        let subtypes: { [id: string]: Subtype; } = {};

        for (let resource of data) {
            if (types[resource.type] == null) {
                let type = new Type();
                type.name = resource.type;
                type.hasSubType = false;
                type.isFree = false;

                types[resource.type] = type;
                firstSubtypes[resource.type] = resource.subtype;
            }

            if (firstSubtypes[resource.type] != resource.subtype) {
                types[resource.type].hasSubType = true;
            }

            if (resource.user == null || resource.user == '') {
                types[resource.type].isFree = true;
            }

            if (resource.type == selectedTypeName) {
                if (subtypes[resource.subtype] == null) {
                    let subtype = new Subtype();
                    subtype.name = resource.subtype;
                    subtype.isFree = false;

                    subtypes[resource.subtype] = subtype;
                }

                if (resource.user == null || resource.user == '') {
                    subtypes[resource.subtype].isFree = true;
                }

                resources.push(resource);
            }
        }

        if (resources != null) {
            this.resources = resources;
            this.types = Object.values(types);
            this.subtypes = Object.values(subtypes);
        }
    }
}