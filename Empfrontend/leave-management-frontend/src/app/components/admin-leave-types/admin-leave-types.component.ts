import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LeaveType, LeaveTypeService } from '../../core/services/leave-type.service';

@Component({
  selector: 'app-leave-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-leave-types.component.html',
  styleUrls: ['./admin-leave-types.component.css']
})
export class AdminLeaveTypesComponent implements OnInit {
  leaveTypes: (LeaveType & { editing?: boolean })[] = [];
  newType: Partial<LeaveType> = { name: '', description: '', maxDaysPerYear: 0 };
  loading = true;
  showModal = false;
  showInactive = false; // ✅ toggle between active/inactive view

  isAdmin = false;
  isManager = false;

  constructor(
    private leaveTypeService: LeaveTypeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isManager = this.authService.isManager();
    this.fetchLeaveTypes();
  }

  // ✅ Fetch leave types (active or all)
  fetchLeaveTypes(): void {
    this.loading = true;
    this.leaveTypeService.getAllLeaveTypes(this.showInactive).subscribe({
      next: (data) => {
        this.leaveTypes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching leave types:', err);
        this.loading = false;
      }
    });
  }

  // ✅ Add new leave type
  addLeaveType(): void {
    if (!this.isAdmin && !this.isManager) return;
    if (!this.newType.name || !this.newType.maxDaysPerYear) {
      alert('Please fill in required fields.');
      return;
    }

    this.leaveTypeService.addLeaveType(this.newType as LeaveType).subscribe({
      next: (created) => {
        this.leaveTypes.push(created);
        this.newType = { name: '', description: '', maxDaysPerYear: 0 };
      },
      error: (err) => console.error('Error adding leave type:', err)
    });
  }

  // ✅ Edit leave type
  editLeaveType(lt: LeaveType & { editing?: boolean }) {
    lt.editing = true;
  }

  // ✅ Update leave type
  updateLeaveType(lt: LeaveType & { editing?: boolean }) {
    this.leaveTypeService.updateLeaveType(lt.id!, lt).subscribe({
      next: (updated) => {
        Object.assign(lt, updated);
        lt.editing = false;
      },
      error: (err) => console.error('Error updating leave type:', err)
    });
  }

  // ✅ Soft delete (mark inactive)
  deleteLeaveType(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to deactivate this leave type?')) {
      this.leaveTypeService.deleteLeaveType(id).subscribe({
        next: () => {
          const lt = this.leaveTypes.find(l => l.id === id);
          if (lt) lt.isActive = false; // mark as inactive locally
        },
        error: (err) => console.error('Error deleting leave type:', err)
      });
    }
  }

  // ✅ Restore a soft-deleted leave type
  restoreLeaveType(id: number | undefined) {
    if (!id) return;
    this.leaveTypeService.restoreLeaveType(id).subscribe({
      next: (restored) => {
        const lt = this.leaveTypes.find(l => l.id === id);
        if (lt) Object.assign(lt, restored);
        alert('Leave type restored successfully!');
      },
      error: (err) => console.error('Error restoring leave type:', err)
    });
  }

  // ✅ Toggle between Active / All
  toggleInactiveView() {
    this.showInactive = !this.showInactive;
    this.fetchLeaveTypes();
  }
}
