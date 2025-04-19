import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Email } from '../shared/utils/mailer/mailer';
import { MailerService } from '../shared/utils/mailer/mailer.service';
import { UtilsService } from '../shared/utils/utils.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ContactComponent implements OnInit {
  contact: Email = {
    titre: '',
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  constructor(
    private mailerService: MailerService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.isValidEmail(this.contact.email)) {
      this.mailerService.sendEmail(this.contact).subscribe({
        next: (response) => {
          this.utilsService.presentAlert(
            'Information',
            'Votre message a bien été envoyé',
            ['OK'],
            'success'
          );
        },
        error: (error) => {
          this.utilsService.presentAlert(
            'Attention',
            "Un problème est survenu lors de l'envoi de votre message",
            ['OK'],
            'error'
          );
        },
      });
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
