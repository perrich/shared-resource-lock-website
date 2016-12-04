import { Pipe, PipeTransform } from '@angular/core';

import { Resource } from './resource';

@Pipe({
  name: 'resource_subtype',
  pure: false
})
export class ResourcesPipe implements PipeTransform {
  transform(allresources: Resource[], subtype : string) {
    return allresources.filter(r => r.subtype === subtype);
  }
}