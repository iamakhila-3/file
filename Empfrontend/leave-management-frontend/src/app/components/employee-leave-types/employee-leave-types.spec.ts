import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveTypes } from './employee-leave-types.component';

describe('EmployeeLeaveTypes', () => {
  let component: EmployeeLeaveTypes;
  let fixture: ComponentFixture<EmployeeLeaveTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLeaveTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLeaveTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
