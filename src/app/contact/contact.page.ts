import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Email } from '../utils/mailer/mailer';
import { MailerService } from '../utils/mailer/mailer.service';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ContactPage implements OnInit {
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
            ['OK']
          );
        },
        error: (error) => {
          this.utilsService.presentAlert(
            'Attention',
            "Un problème est survenu lors de l'envoi de votre message",
            ['OK']
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
