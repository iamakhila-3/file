import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeaveType, LeaveTypeService } from '../../core/services/leave-type.service';

@Component({
  selector: 'app-employee-leave-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-leave-types.component.html',
  styleUrls: ['./employee-leave-types.component.css']
})
export class EmployeeLeaveTypesComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  loading = true;
  errorMessage = '';

  constructor(private leaveTypeService: LeaveTypeService) {}

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.leaveTypeService.getLeaveTypes().subscribe({
      next: (data) => {
        this.leaveTypes = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load leave types';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
