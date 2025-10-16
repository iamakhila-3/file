export interface LeaveRequestDto {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  status: string;
  approverId?: number;
  comments?: string;
  appliedDate: string;
}
