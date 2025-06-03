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
  FormControl,
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
import { TranslateModule } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { environment } from 'src/environments/environment';
import { Fields } from './dynamic-modal-form';

@Component({
  selector: 'app-dynamic-modal-form',
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
  standalone: true,
})
export class DynamicModalFormComponent implements OnInit {
  @Input() title!: string;
  @Input() fields!: Fields[];
  @Input() initialValues!: any;
  @Output() closeModal = new EventEmitter<any>();

  imagesPath = environment.url + '/images/';
  form!: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const controls: { [key: string]: any } = {};
    this.fields.forEach((field) => {
      let initialValue = this.initialValues[field.name];

      if (field.type === 'select' && typeof initialValue === 'object') {
        const nestedField = field.name;
        initialValue = this.initialValues[nestedField]?.id;
      }

      if (field.type === 'object' && typeof initialValue === 'object') {
        const nestedField = field.name;
        const value = field.value;

        initialValue =
          value !== undefined
            ? this.initialValues[nestedField]?.[value]
            : undefined;
      }

      if (field.type === 'datetime' && initialValue) {
        initialValue = this.formatDateTimeForInput(initialValue);
      }

      controls[field.name] = new FormControl(
        {
          value: initialValue ?? '',
          disabled: field.disabled,
        },
        field.required ? Validators.required : []
      );
    });
    this.form = this.fb.group(controls);
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = { ...this.form.value };

      const statusControl = this.form.get('status');
      if (statusControl?.disabled) {
        formData.status = statusControl.value;
      }

      // Parcourir pour traiter les fichiers
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.value && control.value.file instanceof File) {
          formData[key] = control.value.file;
        }
      });

      // Parcourir pour traiter les dates au fuseau Paris
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (
          control?.value &&
          typeof control.value === 'string' &&
          control.value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
        ) {
          formData[key] = moment
            .tz(control.value, 'YYYY-MM-DDTHH:mm', 'Europe/Paris')
            .format('YYYY-MM-DD HH:mm:ss');
        }
      });

      this.closeModal.emit({
        ...formData,
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

  onFileChange(event: any, fieldFile: string, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;

      if (!this.form.contains(fieldFile)) {
        this.form.addControl(
          fieldFile,
          this.fb.control({ file: null, preview: null })
        );
      }

      this.form.get(fieldName)?.setValue(fileName);

      // URL temporaire pour l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.form.get(fieldFile)?.setValue({
          file: file, // référence temp
          preview: e.target.result, // URL de données pour l'aperçu
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
