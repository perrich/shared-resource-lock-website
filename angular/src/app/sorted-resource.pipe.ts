import { Pipe, PipeTransform } from '@angular/core';

import { Resource } from './resource';

/**
 * Order resources by type and sub-type
 * __Usage :__
 *   allresources | sorted_resource
 */
@Pipe({
  name: 'sorted_resource',
  pure: false
})
export class SortedResourcePipe implements PipeTransform {

  transform(allresources: Resource[], args?: any): Resource[] {
    allresources.sort((a: Resource, b: Resource) => {
      if (a.type < b.type) {
        return -1;
      } else if (a.type > b.type) {
        return 1;
      } else {
        if (a.subtype < b.subtype) {
          return -1;
        } else if (a.subtype > b.subtype) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    return allresources;
  }
}
