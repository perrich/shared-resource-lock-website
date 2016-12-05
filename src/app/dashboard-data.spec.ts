import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardData } from './dashboard-data';
import { Type } from './type';
import { Subtype } from './subtype';
import { Resource } from './resource';

////////  SPECS  /////////////
describe('DashboardData', function () {
  const type = 'MY_TYPE';
  const subtype = 'MY_SUBTYPE';
  const otherType = 'MY_OTHER_TYPE';
  const otherSubtype = 'MY_OTHER_SUBTYPE';
  const thirdSubtype = 'MY_THIRD_SUBTYPE';
  let resources: Resource[] = [];
  let resource: Resource;

  beforeEach(() => {
    resources = [];
    resources.push(createResource(1, type, subtype));
    resources.push(createResource(2, type, subtype));
    resources.push(createResource(3, otherType, subtype));
    resources.push(createResource(4, otherType, otherSubtype));
    resources.push(createResource(5, otherType, thirdSubtype));
    resources.push(createResource(6, type, otherSubtype));
  });

  it('should only return all types if no type is selected', () => {
    let data = new DashboardData(resources, null);

    expect(data.types.length).toEqual(2);
    expect(data.types).toContain(jasmine.objectContaining({name: type}));
    expect(data.types).toContain(jasmine.objectContaining({name: otherType}));
    expect(data.subtypes.length).toEqual(0);
    expect(data.resources.length).toEqual(0);
  });

  it('should return all types even if one type is selected', () => {
    let data = new DashboardData(resources, type);
    expect(data.types.length).toEqual(2);
    expect(data.types).toContain(jasmine.objectContaining({name: type}));
    expect(data.types).toContain(jasmine.objectContaining({name: otherType}));
  });

  it('should return all subtypes for the selected type', () => {
    let data = new DashboardData(resources, type);

    expect(data.subtypes.length).toEqual(2);
    expect(data.subtypes).toContain(jasmine.objectContaining({name: subtype}));
    expect(data.subtypes).toContain(jasmine.objectContaining({name: otherSubtype}));
  });

  it('should return all resources for the selected type', () => {
    let data = new DashboardData(resources, type);

    expect(data.resources.length).toEqual(3);
    expect(data.resources).toContain(jasmine.objectContaining({id: 1}));
    expect(data.resources).toContain(jasmine.objectContaining({id: 2}));
    expect(data.resources).toContain(jasmine.objectContaining({id: 6}));
  });

  it('should return type.hasSubTypes to true if at least two subtypes are set', () => {
    let data = new DashboardData(resources, null);

    expect(data.types[0].hasSubTypes).toEqual(true);
    expect(data.types[1].hasSubTypes).toEqual(true);
  });
  
  it('should return type.hasSubTypes to false if at most one subtype is set', () => {
    resources = [];
    resources.push(createResource(1, type, null));
    let data = new DashboardData(resources, null);

    expect(data.types[0].hasSubTypes).toEqual(false);

    resources = [];
    resources.push(createResource(1, type, subtype));
    data = new DashboardData(resources, null);

    expect(data.types[0].hasSubTypes).toEqual(false);
  });
  
  it('should return a free subtype if all resources are free', () => {
    resources = [];
    resources.push(createResource(1, type, subtype));
    resources.push(createResource(2, type, subtype));
    resources.push(createResource(3, type, subtype));
    let data = new DashboardData(resources, type);

    expect(data.subtypes[0].isFree).toEqual(true);
  });
  
  it('should not return a free subtype if at least one resource is not free', () => {
    resources = [];
    resources.push(createResource(1, type, subtype));
    resources.push(createResource(2, type, subtype));
    resources.push(createResource(3, type, subtype));
    resources[1].user = "sample";
    resources[1].date = new Date();
    let data = new DashboardData(resources, type);

    expect(data.subtypes[0].isFree).toEqual(false);
  });

  function createResource(id: number, type: string, subtype: string): Resource {
    let resource = new Resource();
    resource.id = id;
    resource.name = 'sample ' + id;
    resource.type = type;
    resource.subtype = subtype;
    return resource;
  }
});
