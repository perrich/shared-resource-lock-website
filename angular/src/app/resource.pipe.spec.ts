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
    const resources: Resource[] = [];

    const value1 = createResource(2, subtype);
    const value2 = createResource(4, subtype);

    resources.push(createResource(1, 'sample'));
    resources.push(value1);
    resources.push(createResource(3, 'other'));
    resources.push(value2);
    const results = pipe.transform(resources, subtype);

    expect(results.length).toEqual(2);
    expect(results).toContain(value1);
    expect(results).toContain(value2);
  });

  function createResource(id: number, mysubtype: string): Resource {
    const resource = new Resource();
    resource.id = id;
    resource.name = 'sample ' + id;
    resource.subtype = mysubtype;
    return resource;
  }
});
