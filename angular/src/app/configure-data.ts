import { Resource } from './resource';
import { Type } from './type';
import { Subtype } from './subtype';

/**
 * Configuration
 */
export class ConfigureData {

    /**
     * Available Sub-types
     */
    subtypes: string[] = [];

    /**
     * Available types
     */
    types: string[] = [];

    constructor(data: Resource[]) {
      const types: { [id: string]: string; } = {};
      const subtypes: { [id: string]: string; } = {};

        for (const resource of data) {
            if (types[resource.type] == null) {
                types[resource.type] = resource.type;
            }
            if (subtypes[resource.subtype] == null) {
                subtypes[resource.subtype] = resource.subtype;
            }
        }

        const nullValue = null;
        if (subtypes[nullValue] == null) {
            subtypes[nullValue] = nullValue;
        }

        this.types = Object.values(types);
        this.subtypes = Object.values(subtypes);
    }
}
