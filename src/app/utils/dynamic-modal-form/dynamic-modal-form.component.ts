import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Fields } from './dynamic-modal-form';

@Component({
  selector: 'app-dynamic-modal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './dynamic-modal-form.component.html',
  styleUrls: ['./dynamic-modal-form.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class DynamicModalFormComponent implements OnInit {
  @Input() title!: string;
  @Input() fields!: Fields[];
  @Input() initialValues!: any;
  @Output() closeModal = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {
    const controls: { [key: string]: any } = {};
    this.fields.forEach((field) => {
      let initialValue = this.initialValues[field.name];

      if (field.type === 'select' && typeof initialValue === 'object') {
        const nestedField = field.name;
        initialValue = this.initialValues[nestedField]?.id;
      }

      if (field.type === 'datetime' && initialValue) {
        initialValue = this.formatDateTimeForInput(initialValue);
      }

      controls[field.name] = [
        initialValue ?? '',
        field.required ? Validators.required : [],
      ];
    });
    this.form = this.fb.group(controls);
    console.log('this.form : ', this.form);
    console.log('this.form.valid : ', this.form.valid);
    console.log(this.form.controls['auditorium'].value); // Vérifiez la valeur initiale du champ 'auditorium'
    console.log(this.form.controls['film'].value);
  }

  onSubmit() {
    if (this.form.valid) {
      this.closeModal.emit({
        ...this.form.value,
        isModified: !this.form.pristine,
      });
    }
  }

  cancel() {
    this.closeModal.emit();
  }

  formatDateTimeForInput(initialValue: string): string {
    const dateObj = new Date(initialValue);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
