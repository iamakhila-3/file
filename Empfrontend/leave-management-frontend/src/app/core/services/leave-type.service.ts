import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LeaveType {
  id: number;
  name: string;
  description: string;
  maxDaysPerYear: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private apiUrl = 'http://localhost:8080/api/leave-types';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Get all leave types (active only by default)
  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // ✅ Get all leave types (including inactive)
  getAllLeaveTypes(includeInactive = false): Observable<LeaveType[]> {
    const url = includeInactive ? `${this.apiUrl}/all` : this.apiUrl;
    return this.http.get<LeaveType[]>(url, { headers: this.getAuthHeaders() });
  }

  // ✅ Add new leave type
  addLeaveType(leaveType: Partial<LeaveType>): Observable<LeaveType> {
    return this.http.post<LeaveType>(this.apiUrl, leaveType, { headers: this.getAuthHeaders() });
  }

  // ✅ Update existing leave type
  updateLeaveType(id: number, leaveType: Partial<LeaveType>): Observable<LeaveType> {
    return this.http.put<LeaveType>(`${this.apiUrl}/${id}`, leaveType, { headers: this.getAuthHeaders() });
  }

  // ✅ Soft-delete (mark inactive)
  deleteLeaveType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ✅ Restore soft-deleted leave type
  restoreLeaveType(id: number): Observable<LeaveType> {
    return this.http.put<LeaveType>(`${this.apiUrl}/${id}/restore`, {}, { headers: this.getAuthHeaders() });
  }
}
