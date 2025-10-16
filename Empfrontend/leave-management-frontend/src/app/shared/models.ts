export interface LoginRequest { username: string; password: string }
export interface LoginResponse { token: string; username?: string; roles?: string[] }

export interface Employee { id?: number; firstName: string; lastName: string; email: string; position?: string }
export interface LeaveType { id?: number; name: string; description?: string }
export interface LeaveRequestDto {
    id?: number;
    employeeId: number;
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    status?: string;
    comments?: string
}
