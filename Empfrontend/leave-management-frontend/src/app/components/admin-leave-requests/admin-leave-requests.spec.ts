import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeaveRequestsComponent } from './admin-leave-requests.component';

describe('LeaveRequests', () => {
  let component: AdminLeaveRequestsComponent;
  let fixture: ComponentFixture<AdminLeaveRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeaveRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLeaveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
