import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  employee: any = null;
  searchTerm = '';
  showModal = false;

  isAdmin = false;
  isManager = false;

  newEmployee: any = {
    employeeId: '',
    name: '',
    email: '',
    department: '',
    managerId: null
  };

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.isManager = this.authService.isManager();

    if (this.isAdmin || this.isManager) {
      this.loadEmployees(); // Admin & Manager — can view all
    } else {
      this.loadEmployeeProfile(); // Employee — view only self
    }
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (res) => (this.employees = res),
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  loadEmployeeProfile() {
    const id = this.authService.getEmployeeId();
    if (!id) return;
    this.employeeService.getById(id).subscribe({
      next: (res) => (this.employee = res),
      error: (err) => console.error('Error loading employee:', err)
    });
  }

  filteredEmployees() {
    if (!this.searchTerm) return this.employees;
    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(
      (e) =>
        e.name?.toLowerCase().includes(term) ||
        e.employeeId?.toLowerCase().includes(term)
    );
  }

  openModal() {
    if (!this.isAdmin) return; // Only Admin can open modal
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveEmployee() {
    if (!this.isAdmin) return; // Only Admin can save
    const payload = { ...this.newEmployee };
    if (payload.managerId) {
      payload.manager = { id: payload.managerId };
      delete payload.managerId;
    }

    this.employeeService.create(payload).subscribe({
      next: () => {
        this.loadEmployees();
        this.resetForm();
        this.closeModal();
      },
      error: (err) => alert('Failed to save employee: ' + err.message)
    });
  }

  private resetForm() {
    this.newEmployee = {
      employeeId: '',
      name: '',
      email: '',
      department: '',
      managerId: null
    };
  }
}
