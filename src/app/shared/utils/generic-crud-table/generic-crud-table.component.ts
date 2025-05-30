import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/app';
import { AuthService } from 'src/app/auth/auth.service';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { environment } from 'src/environments/environment';
import { Fields } from '../dynamic-modal-form/dynamic-modal-form';
import { DynamicModalFormComponent } from '../dynamic-modal-form/dynamic-modal-form.component';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-generic-crud-table',
  templateUrl: './generic-crud-table.component.html',
  styleUrls: ['./generic-crud-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatDialogModule,
    DynamicModalFormComponent,
    SafePipe,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class GenericCrudTableComponent implements OnInit {
  @Input() title: string = "Modifier l'élément";
  @Input() items: any[] = [];
  @Input() addItemAvailable?: boolean = true;
  @Input() fields: Fields[] = [];
  @Input() emptyItem: any = {};
  @Input() columnsToDisplay: Array<string | { name: string; type: string }> =
    [];
  @Input() columnLabels: Record<string, string> = {};
  @Input() booleanLabels?: Record<string, { true: string; false: string }> = {};
  @Input() defaultBooleanLabels?: { true: string; false: string } = {
    true: 'Oui',
    false: 'Non',
  };
  @Input() resetPassword?: boolean = false;

  @Output() openingModal = new EventEmitter<any>();
  @Output() addItem = new EventEmitter<any>();
  @Output() updateItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  imagesPath = environment.url + '/images/';
  showModal: boolean = false;
  initialValues: any;
  paginatedItems: any[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['items'] &&
      changes['items'].currentValue &&
      Array.isArray(changes['items'].currentValue)
    ) {
      this.updatePagination();
    }
  }

  updatePagination() {
    this.itemsPerPage = Number(this.itemsPerPage);

    if (this.items && Array.isArray(this.items)) {
      this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
      this.currentPage = 1;
      this.paginateItems();
    } else {
      this.totalPages = 1;
      this.currentPage = 1;
      this.paginatedItems = [];
    }
  }

  paginateItems() {
    this.itemsPerPage = Number(this.itemsPerPage);

    if (!this.items || !Array.isArray(this.items)) {
      this.paginatedItems = [];
      return;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.items.length
    );

    this.paginatedItems = this.items.slice(startIndex, endIndex);
  }

  changeItemsPerPage() {
    this.itemsPerPage = Number(this.itemsPerPage);
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateItems();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateItems();
    }
  }

  openModal(item?: any) {
    if (!item) {
      item = { ...this.emptyItem };
    }

    this.openingModal.emit(item);
    this.initialValues = item;
    this.showModal = true;
  }

  onModalClose(result?: any) {
    this.showModal = false;

    if (result) {
      if (result.id === undefined || result.id === '') {
        this.addItem.emit(result);
      } else {
        this.updateItem.emit(result);
      }
    }
  }

  onDeleteItem(item: any) {
    this.deleteItem.emit(item);
  }

  onResetItem(user: User) {
    this.authService.requestPasswordReset(user.email).subscribe({
      next: (response) => {
        this.utilsService.presentAlert(
          'Information',
          'Un e-mail de réinitialisation de mot de passe a été envoyé.',
          ['OK'],
          'success'
        );
      },
      error: (error) => {
        this.utilsService.presentAlert(
          'Information',
          "Une erreur s'est produite. Veuillez réessayer.",
          ['OK'],
          'error'
        );
      },
    });
  }

  getColumnName(column: string | { name: string; type: string }): string {
    return typeof column === 'string' ? column : column.name;
  }

  getColumnType(
    column: string | { name: string; type: string }
  ): string | undefined {
    return typeof column === 'object' ? column.type : undefined;
  }

  isBoolean(
    value: any,
    column: string | { name: string; type: string }
  ): boolean {
    const columnType = this.getColumnType(column);
    if (columnType === 'boolean') {
      return true;
    }
    return typeof value === 'boolean';
  }

  isDate(value: any, column: string | { name: string; type: string }): boolean {
    const columnType = this.getColumnType(column);
    if (columnType === 'datetime') {
      return true;
    }
    return false;
  }

  isImage(
    value: any,
    column: string | { name: string; type: string }
  ): boolean {
    const columnType = this.getColumnType(column);
    if (columnType === 'image') {
      return true;
    }
    return false;
  }

  // Valeur d'affichage suivant son type
  getDisplayValue(
    value: any,
    column: string | { name: string; type: string }
  ): string {
    if (this.isBoolean(value, column)) {
      return value ? 'true' : 'false';
    }

    return value?.toString() || '';
  }

  // Valeur imbriquée (par exemple, 'auditorium.name')
  getNestedValue(item: any, path: string): any {
    return path
      .split('.')
      .reduce(
        (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''),
        item
      );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('fr-FR', options);
  }
}
