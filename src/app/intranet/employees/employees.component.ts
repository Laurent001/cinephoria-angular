import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs';
import { User } from 'src/app/app';
import { LoginService } from 'src/app/login/login.service';
import { Fields } from 'src/app/utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from 'src/app/utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from 'src/app/utils/utils.service';
import { EmployeesService } from './employees.service';

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
    { name: 'role.name', type: 'string' },
  ];
  columnLabels: Record<string, string> = {
    id: '#',
    email: 'Email',
    first_name: 'Prénom',
    last_name: 'Nom',
    'role.name': 'Rôle',
  };

  constructor(
    private translate: TranslateService,
    private employeesService: EmployeesService,
    private utilsService: UtilsService,
    private loginService: LoginService
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
        name: 'password',
        label: 'Mot de passe',
        type: 'text',
        required: true,
      },
      {
        name: 'role',
        label: 'rôle',
        type: 'select',
        options: [
          {
            label: 'admin',
            value: 1,
          },
          {
            label: 'staff',
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
      password: '',
      role: { id: 2, name: 'staff' },
    };
  }

  onAddEmployee(employee: User) {
    const employeeModified = this.getEmployeeResponseModified(
      this.getEmptyEmployee(),
      employee
    );
    this.loginService
      .register(employeeModified)
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

  onOpeningModal(employee: User) {
    delete employee.password;
    this.fields = this.fields.filter((field) => field.name !== 'password');
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
        'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
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
      password: data.password,
      role: {
        id: data.role,
        name: data.role === 1 ? 'admin' : 'staff',
      },
    };
  }
}
