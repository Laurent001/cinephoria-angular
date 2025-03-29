import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/app';
import { environment } from 'src/environments/environment.dev';
const ROLE_STAFF = 'staff';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.url}/api/user/employees`);
  }

  updateEmployee(employee: User): Observable<User> {
    return this.http.put<User>(`${environment.url}/api/user/update`, employee);
  }

  deleteEmployeeById(employeeId: number): Observable<User> {
    return this.http.delete<User>(
      `${environment.url}/api/user/delete/${employeeId}`
    );
  }

  addEmployee(employee: User): Observable<User> {
    return this.http.post<User>(
      `${environment.url}/api/user/${ROLE_STAFF}/add`,
      employee
    );
  }
}
