import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaveRequestDto } from '../models/leave-request.dto';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private baseUrl = 'http://localhost:8080/api/leave-requests';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('lm_token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  add(request: Partial<LeaveRequestDto>): Observable<LeaveRequestDto> {
    return this.http.post<LeaveRequestDto>(`${this.baseUrl}/apply`, request, this.getHeaders());
  }

  getMyLeaveRequests(): Observable<LeaveRequestDto[]> {
    return this.http.get<LeaveRequestDto[]>(`${this.baseUrl}/my-leave-requests`, this.getHeaders());
  }

  getPendingRequestsForManager(): Observable<LeaveRequestDto[]> {
    return this.http.get<LeaveRequestDto[]>(`${this.baseUrl}/pending`, this.getHeaders());
  }

  approve(id: number, comments?: string): Observable<LeaveRequestDto> {
    const url = `${this.baseUrl}/${id}/approve${comments ? '?comments=' + comments : ''}`;
    return this.http.put<LeaveRequestDto>(url, {}, this.getHeaders());
  }

  reject(id: number, comments?: string): Observable<LeaveRequestDto> {
    const url = `${this.baseUrl}/${id}/reject${comments ? '?comments=' + comments : ''}`;
    return this.http.put<LeaveRequestDto>(url, {}, this.getHeaders());
  }

  getAll(): Observable<LeaveRequestDto[]> {
    return this.http.get<LeaveRequestDto[]>(this.baseUrl, this.getHeaders());
  }
}
