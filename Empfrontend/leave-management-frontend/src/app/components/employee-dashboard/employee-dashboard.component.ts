import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeLeaveRequestsComponent } from '../employee-leave-requests/employee-leave-requests.component';
import { EmployeeLeaveTypesComponent } from '../employee-leave-types/employee-leave-types.component';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, EmployeeLeaveTypesComponent, EmployeeLeaveRequestsComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  activeTab: 'types' | 'requests' = 'types';
  employee: any;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    const empId = localStorage.getItem('employeeId');
    if (empId) {
      // ✅ use empId directly (it's a string like "EMP3")
      this.employeeService.getById(empId).subscribe({
        next: (data) => {
          this.employee = data;
          console.log('Employee loaded:', this.employee);
        },
        error: (err) => {
          console.error('Error loading employee', err);
        }
      });
    }
  }
}
