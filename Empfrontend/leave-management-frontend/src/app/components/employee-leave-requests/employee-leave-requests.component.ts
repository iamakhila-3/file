import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveRequestService } from '../../core/services/leave-request.service';

@Component({
  selector: 'app-employee-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-leave-requests.component.html',
  styleUrls: ['./employee-leave-requests.component.css']
})
export class EmployeeLeaveRequestsComponent implements OnInit {

  leaveRequests: any[] = [];
  leaveTypes: any[] = [];
  
  // Changed null -> undefined for TypeScript compatibility
  newRequest = { leaveTypeId: undefined as number | undefined, leaveTypeName: '', startDate: '', endDate: '', reason: '' };
  
  showModal = false;

  constructor(private leaveRequestService: LeaveRequestService) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
    this.loadLeaveTypes();
  }

  loadLeaveRequests(): void {
  this.leaveRequestService.getMyLeaveRequests().subscribe({
    next: (data) => {
      this.leaveRequests = data;
    },
    error: (err) => console.error('Error loading leave requests:', err)
  });
}


  loadLeaveTypes(): void {
    // Temporary static until backend integration
    this.leaveTypes = [
      { id: 1, name: 'Annual Leave' },
      { id: 2, name: 'Sick Leave' },
      { id: 3, name: 'Casual Leave' },
      { id: 4, name: 'Maternity Leave' },
      { id: 5, name: 'Paternity Leave' },
      { id: 6, name: 'Earned Leave' },
      { id: 7, name: 'Bereavement Leave' },
      { id: 8, name: 'Compensatory Leave' },
      { id: 9, name: 'Study Leave' },
      { id: 10, name: 'Marriage Leave' },
      { id: 11, name: 'Unpaid Leave' },
      { id: 12, name: 'Public Holiday' },
    ];
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  addLeaveRequest(): void {
    const { leaveTypeId, leaveTypeName, startDate, endDate, reason } = this.newRequest;

    if ((!leaveTypeId && !leaveTypeName) || !startDate || !endDate || !reason) {
      alert('Please fill all required fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      alert('End date must be after start date');
      return;
    }

    const daysRequested = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const finalLeaveTypeName = leaveTypeId
      ? this.leaveTypes.find(t => t.id === leaveTypeId)?.name ?? ''
      : leaveTypeName;

    // Ensure leaveTypeId is undefined if not selected
    const newReq = {
      leaveTypeId: leaveTypeId ?? undefined,
      leaveTypeName: finalLeaveTypeName,
      startDate,
      endDate,
      reason,
      daysRequested
    };

    this.leaveRequestService.add(newReq).subscribe({
      next: (saved) => {
        this.leaveRequests.push({ ...saved, leaveTypeName: finalLeaveTypeName });
        this.newRequest = { leaveTypeId: undefined, leaveTypeName: '', startDate: '', endDate: '', reason: '' };
        this.showModal = false;
      },
      error: (err) => console.error('Error saving request:', err)
    });
  }
}
