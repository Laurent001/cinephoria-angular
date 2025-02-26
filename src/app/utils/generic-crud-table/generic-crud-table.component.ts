import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Fields } from '../dynamic-modal-form/dynamic-modal-form';
import { DynamicModalFormComponent } from '../dynamic-modal-form/dynamic-modal-form.component';

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
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class GenericCrudTableComponent implements OnInit {
  @Input() title: string = "Modifier l'élément";
  @Input() items: any[] = [];
  @Input() fields: Fields[] = [];
  @Input() emptyItem: any = {};
  @Input() columnsToDisplay: Array<string | { name: string; type: string }> =
    [];
  @Input() columnLabels: Record<string, string> = {};

  // Nouvelles entrées pour personnaliser les libellés des valeurs booléennes
  @Input() booleanLabels: Record<string, { true: string; false: string }> = {};
  @Input() defaultBooleanLabels: { true: string; false: string } = {
    true: 'Oui',
    false: 'Non',
  };

  @Output() addItem = new EventEmitter<any>();
  @Output() updateItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  showModal: boolean = false;
  initialValues: any;
  paginatedItems: any[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

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
    this.initialValues = item;
    this.showModal = true;
  }

  onModalClose(result?: any) {
    this.showModal = false;

    if (result) {
      if (result.id === 0) {
        this.addItem.emit(result);
      } else {
        this.updateItem.emit(result);
      }
    }
  }

  onDeleteItem(item: any) {
    this.deleteItem.emit(item);
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
    if (columnType === 'Date') {
      return true;
    }
    return value instanceof Date;
  }

  // Valeur d'affichage suivant son type
  getDisplayValue(
    value: any,
    column: string | { name: string; type: string }
  ): string {
    const columnName = typeof column === 'string' ? column : column.name;

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
}
