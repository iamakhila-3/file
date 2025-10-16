import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LeaveRequestService } from '../../core/services/leave-request.service';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf],
  templateUrl: './admin-leave-requests.component.html',
  styleUrls: ['./admin-leave-requests.component.css']
})
export class AdminLeaveRequestsComponent implements OnInit {
  leaves: any[] = [];
  searchTerm: string = '';

  isAdmin = false;
  isManager = false;

  constructor(
    private svc: LeaveRequestService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.isManager = this.authService.isManager();
    this.load();
  }

  load() {
    this.svc.getAll().subscribe((r: any[]) => this.leaves = r);
  }

  filteredRequests() {
    if (!this.searchTerm) return this.leaves;
    const term = this.searchTerm.toLowerCase();
    return this.leaves.filter(l =>
      l.employeeName?.toLowerCase().includes(term) ||
      l.status?.toLowerCase().includes(term) ||
      (l.approverId && l.approverId.toString().includes(term))
    );
  }

  approve(l: any) {
    this.svc.approve(l.id, l.comments).subscribe(() => this.load());
  }

  reject(l: any) {
    this.svc.reject(l.id, l.comments).subscribe(() => this.load());
  }

  approveLeave(reqId: number) {
    if (!this.isAdmin && !this.isManager) return;
    this.svc.approve(reqId).subscribe(() => this.load());
  }

  rejectLeave(reqId: number) {
    if (!this.isAdmin && !this.isManager) return;
    this.svc.reject(reqId).subscribe(() => this.load());
  }

  resetStatus(l: any) {
    l.status = 'PENDING';
    l.comments = '';
  }
}
