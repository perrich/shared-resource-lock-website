import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureListComponent } from './configure-list.component';

describe('ConfigureListComponent', () => {
  let component: ConfigureListComponent;
  let fixture: ComponentFixture<ConfigureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
