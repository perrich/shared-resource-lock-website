import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureFormComponent } from './configure-form.component';

describe('ConfigureFormComponent', () => {
  let component: ConfigureFormComponent;
  let fixture: ComponentFixture<ConfigureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
