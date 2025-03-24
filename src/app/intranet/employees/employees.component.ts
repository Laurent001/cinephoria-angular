import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs';
import { User } from 'src/app/app';
import { Fields } from 'src/app/utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from 'src/app/utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from 'src/app/utils/utils.service';
import { EmployeesService } from './employees.service';

const EMPLOYEE_ROLE = 'employee';
const ADMIN_ROLE = 'admin';

@Component({
  selector: 'app-employees           ',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, GenericCrudTableComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class EmployeesComponent implements OnInit {
  employees: User[] = [];
  fields: Fields[] = [];
  columnsToDisplay = [
    { name: 'id', type: 'number' },
    { name: 'email', type: 'string' },
    { name: 'first_name', type: 'string' },
    { name: 'last_name', type: 'string' },
    { name: 'role', type: 'string' },
  ];
  columnLabels: Record<string, string> = {
    id: '#',
    email: 'Email',
    first_name: 'Prénom',
    last_name: 'Nom',
    role: 'Rôle',
  };

  constructor(
    private translate: TranslateService,
    private employeesService: EmployeesService,
    private utilsService: UtilsService
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employeesService
      .getEmployees()
      .pipe(
        tap((employees) => {
          console.log('employees : ', employees);
          this.employees = employees;
          this.fields = this.getFields();
        })
      )
      .subscribe();
  }

  getFields(): Fields[] {
    return [
      { name: 'id', label: 'id', type: 'masked' },
      {
        name: 'email',
        label: 'email',
        type: 'text',
        required: true,
      },
      {
        name: 'first_name',
        label: 'Prénom',
        type: 'text',
        required: true,
      },
      {
        name: 'last_name',
        label: 'Nom',
        type: 'text',
        required: true,
      },

      {
        name: 'role',
        label: 'rôle',
        type: 'select',
        options: [
          {
            label: 'employee',
            value: 1,
          },
          {
            label: 'admin',
            value: 2,
          },
        ],
        required: true,
      },
    ];
  }

  getEmptyEmployee(): User {
    return {
      id: undefined,
      email: '',
      first_name: '',
      last_name: '',
      role: '',
    };
  }

  onAddEmployee(employee: User) {
    const employeeModified = this.getEmployeeResponseModified(
      this.getEmptyEmployee(),
      employee
    );
    this.employeesService
      .addEmployee(employeeModified)
      .pipe(
        tap((response) => {
          this.getEmployees();

          this.utilsService.presentAlert(
            'Création réussie ',
            'La séance a été ajoutée',
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onUpdateEmployee(employee: User) {
    const EmployeeModified = this.getEmployeeResponseModified(
      this.getEmptyEmployee(),
      employee
    );
    this.employeesService
      .updateEmployee(EmployeeModified)
      .pipe(
        tap((response) => {
          this.getEmployees();

          this.utilsService.presentAlert(
            'Mise à jour réussie ',
            'La séance a été mise à jour',
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onDeleteEmployee(employee: User) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Cela va supprimer toutes les sièges et réservations associés à cette séance. Êtes-vous sûr de vouloir supprimer cette séance ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && employee.id) {
            return this.employeesService.deleteEmployeeById(employee.id).pipe(
              tap((deleteResponse) => {
                this.getEmployees();

                this.utilsService.presentAlert(
                  'Suppression réussie ',
                  'La séance a été supprimée',
                  ['OK'],
                  'success'
                );
              })
            );
          }
          return [];
        })
      )
      .subscribe();
  }

  getEmployeeResponseModified(employee: User, data: any): User {
    return {
      ...employee,
      id: data.id !== '' ? data.id : undefined,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role === 1 ? EMPLOYEE_ROLE : ADMIN_ROLE,
    };
  }
}
