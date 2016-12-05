import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPipe } from './resource.pipe';
import { Resource } from './resource';

////////  SPECS  /////////////
describe('ResourcesPipe', function () {
  const subtype = 'MY_SUBTYPE';
  let pipe: ResourcesPipe;

  beforeEach(() => {
    pipe = new ResourcesPipe();
  });

  it('should filter by subtype', () => {
    let resources: Resource[] = [];
    let resource: Resource;

    let value1 = createResource(2, subtype);
    let value2 = createResource(4, subtype);

    resources.push(createResource(1, "sample"));
    resources.push(value1);
    resources.push(createResource(3, "other"));
    resources.push(value2);
    let results = pipe.transform(resources, subtype);

    expect(results.length).toEqual(2);
    expect(results).toContain(value1);
    expect(results).toContain(value2);
  });

  function createResource(id: number, subtype: string): Resource {
    let resource = new Resource();
    resource.id = id;
    resource.name = 'sample ' + id;
    resource.subtype = subtype;
    return resource;
  }
});
