import { Resource } from './resource';
import { Type } from './type';
import { Subtype } from './subtype';

/**
 * Configuration
 */
export class DashboardData {
    /**
     * Resources of the selected type
     */
    resources: Resource[] = [];

    /**
     * Sub-types of the selected type
     */
    subtypes: Subtype[] = [];

    /**
     * Available types
     */
    types: Type[] = [];

    constructor(data: Resource[], selectedTypeName: string | null) {
      const resources: Resource[] = [];
      const typeNames: string[] = [];
      const firstSubtypes: { [id: string]: string; } = {};
      const types: { [id: string]: Type; } = {};
      const subtypes: { [id: string]: Subtype; } = {};

        for (const resource of data) {
            if (types[resource.type] == null) {
              const type = new Type();
                type.name = resource.type;
                type.hasSubTypes = false;
                type.isFree = false;

                types[resource.type] = type;
                firstSubtypes[resource.type] = resource.subtype;
            }

            if (firstSubtypes[resource.type] !== resource.subtype) {
                types[resource.type].hasSubTypes = true;
            }

            if (resource.user == null || resource.user === '') {
                types[resource.type].isFree = true;
            }

            if (resource.type === selectedTypeName) {
                if (subtypes[resource.subtype] == null) {
                    const subtype = new Subtype();
                    subtype.name = resource.subtype;
                    subtype.isFree = false;

                    subtypes[resource.subtype] = subtype;
                }

                if (resource.user == null || resource.user === '') {
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
