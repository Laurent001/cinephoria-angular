import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CinemaService } from '../cinema/cinema.service';

@Component({
  selector: 'app-logout',
  template: '',
  standalone: true,
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cinemaService: CinemaService
  ) {}

  ngOnInit() {
    this.authService.resetUserToGuest();
    this.cinemaService.updateCinemaById(undefined);
    this.router.navigate(['/home']);
  }
}
