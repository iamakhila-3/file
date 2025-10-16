import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api'; // adjust if backend runs on another port/host

  constructor(private http: HttpClient) {}

  // Generic helpers
  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url);
  }
  post(url: string, body: any): Observable<any> {
    return this.http.post(this.baseUrl + url, body);
  }
  put(url: string, body: any): Observable<any> {
    return this.http.put(this.baseUrl + url, body);
  }
  delete(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + url);
  }

  // ---------------------------
  // 🔹 Authentication
  // ---------------------------
  login(role: string, credentials: any): Observable<any> {
    return this.post(`/auth/login/${role}`, credentials);
  }

  register(user: any): Observable<any> {
    return this.post('/auth/register', user);
  }

  forgotPassword(email: string): Observable<any> {
    return this.post('/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    // ✅ important: backend expects "newPassword", not "password"
    return this.post('/auth/reset-password', { token, newPassword });
  }

  // ---------------------------
  // 🔹 Employees
  // ---------------------------
  getEmployees(): Observable<any> {
    return this.get('/employees');
  }

  addEmployee(emp: any): Observable<any> {
    return this.post('/employees', emp);
  }

  updateEmployee(id: number, emp: any): Observable<any> {
    return this.put(`/employees/${id}`, emp);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.delete(`/employees/${id}`);
  }

  // ---------------------------
  // 🔹 Leave Requests
  // ---------------------------
  getLeaveRequests(): Observable<any> {
    return this.get('/leave-requests');
  }

  addLeaveRequest(lr: any): Observable<any> {
    return this.post('/leave-requests', lr);
  }

  updateLeaveRequest(id: number, lr: any): Observable<any> {
    return this.put(`/leave-requests/${id}`, lr);
  }

  deleteLeaveRequest(id: number): Observable<any> {
    return this.delete(`/leave-requests/${id}`);
  }

  // ---------------------------
  // 🔹 Leave Types
  // ---------------------------
  getLeaveTypes(): Observable<any> {
    return this.get('/leave-types');
  }

  addLeaveType(lt: any): Observable<any> {
    return this.post('/leave-types', lt);
  }

  updateLeaveType(id: number, lt: any): Observable<any> {
    return this.put(`/leave-types/${id}`, lt);
  }

  deleteLeaveType(id: number): Observable<any> {
    return this.delete(`/leave-types/${id}`);
  }
}
