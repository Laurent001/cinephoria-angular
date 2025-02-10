import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {
  Component,
  EventEmitter,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Fields } from './dynamic-modal-form';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './dynamic-modal-form.component.html',
  styleUrls: ['./dynamic-modal-form.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class DynamicModalFormComponent {
  @Input() title = 'Modifier';
  @Input() fields: Fields[] = [];
  @Input() initialValues: any = {};
  @Output() save = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    registerLocaleData(localeFr);
  }

  ngOnInit() {
    const controls: { [key: string]: any } = {};
    this.fields.forEach((field) => {
      controls[field.name] = [
        this.initialValues[field.name as keyof typeof this.initialValues] || '',
        field.required ? Validators.required : [],
      ];
    });
    this.form = this.fb.group(controls);
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      this.modalCtrl.dismiss(this.form.value, 'save');
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
