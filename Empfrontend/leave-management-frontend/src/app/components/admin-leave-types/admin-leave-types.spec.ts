import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeaveTypesComponent } from './admin-leave-types.component';

describe('LeaveTypes', () => {
  let component: AdminLeaveTypesComponent;
  let fixture: ComponentFixture<AdminLeaveTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeaveTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLeaveTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
