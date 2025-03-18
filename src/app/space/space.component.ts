import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BarRatingModule } from 'ngx-bar-rating';
import { Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth/auth.service';
import { Booking } from '../booking/booking';
import { BookingService } from '../booking/booking.service';
import { FilmService } from '../film/film.service';
import { Fields } from '../utils/dynamic-modal-form/dynamic-modal-form';
import { DynamicModalFormComponent } from '../utils/dynamic-modal-form/dynamic-modal-form.component';
import { UtilsService } from '../utils/utils.service';
import { OpinionResponse, SpaceResponse } from './space';
import { SpaceService } from './space.service';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DynamicModalFormComponent,
    BarRatingModule,
  ],
})
export class SpaceComponent implements OnInit {
  space: SpaceResponse;
  environment = environment;
  imagesPath = environment.url + '/images/';
  showModal: boolean = false;
  initialValues: any;
  opinion: OpinionResponse = this.getEmptyOpinion();
  userId = this.authService.getCurrentUser()?.id;

  @Input() title: string = 'Noter le film ';
  @Input() fields: Fields[] = [];
  @Input() emptyItem: any = {};
  rate?: number = undefined;

  constructor(
    private spaceService: SpaceService,
    private authService: AuthService,
    private bookingService: BookingService,
    private utilsService: UtilsService,
    private filmService: FilmService
  ) {
    this.space = { openBookings: [], closedBookings: [] };
  }

  ngOnInit() {
    this.loadUserSpace().subscribe();
  }

  loadUserSpace(): Observable<any> {
    return this.spaceService.getSpaceByUserId(this.userId).pipe(
      tap((spaceResponse) => {
        this.space.openBookings = spaceResponse.openBookings;
        this.space.closedBookings = spaceResponse.closedBookings;
      })
    );
  }

  getFields(): Fields[] {
    return [
      { name: 'id', label: 'id', type: 'masked' },
      { name: 'user', label: 'Utilisateur', type: 'masked' },
      { name: 'film', label: 'Film', type: 'masked' },
      {
        name: 'rating',
        label: 'note',
        type: 'select',
        options: [
          {
            label: '1',
            value: 1,
          },
          {
            label: '2',
            value: 2,
          },
          {
            label: '3',
            value: 3,
          },
          {
            label: '4',
            value: 4,
          },
          {
            label: '5',
            value: 5,
          },
        ],
        required: true,
      },
      {
        name: 'description',
        label: 'description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'status',
        label: 'Statut',
        type: 'text',
        readonly: true,
      },
    ];
  }

  getOpinion(
    userId: number,
    filmId: number
  ): Observable<OpinionResponse | null> {
    if (!this.userId) {
      this.utilsService.presentAlert(
        'Attention',
        'Vous devez être connecté pour effectuer une réservation',
        ['OK'],
        'warn'
      );
      return of(null);
    } else {
      return this.filmService.getOpinion(userId, filmId).pipe(
        tap((opinion) => {
          if (!opinion) {
            opinion = this.getEmptyOpinion();
          } else {
            this.opinion = opinion;
          }
        })
      );
    }
  }

  getEmptyOpinion(): OpinionResponse {
    return {
      id: undefined,
      user: undefined,
      film: undefined,
      rating: 0,
      description: '',
      status: 'needs approval',
    };
  }

  deleteBooking(bookingId: number) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Êtes-vous sûr de vouloir supprimer cet incident ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && bookingId) {
            return this.bookingService.deleteBookingById(bookingId).pipe(
              switchMap((deleted) => {
                if (deleted) {
                  return this.loadUserSpace();
                }
                return of(false);
              }),
              tap(() => {
                this.utilsService.presentAlert(
                  'Suppression réussie ',
                  'Votre réservation a été supprimée',
                  ['OK'],
                  'success'
                );
              })
            );
          }
          return of(false);
        })
      )
      .subscribe();
  }

  scoreFilm(filmId: number, rating: number): void {
    this.showModal = true;
    this.bookingService.scoreFilmById(filmId, rating);
  }

  getSeatNumbers(seats: any[]): string {
    return seats.map((seat) => seat.number).join(', ');
  }

  openModal = (booking: Booking, item?: any) => {
    if (!item) {
      item = { ...this.emptyItem };
    }
    this.fields = this.getFields();
    this.initialValues = this.opinion;

    if (
      this.userId &&
      booking.screening &&
      booking.screening.film &&
      booking.screening.film.id
    ) {
      this.getOpinion(this.userId, booking.screening.film.id)
        .pipe(
          tap((response) => {
            if (response === null) {
              this.initialValues = this.getEmptyOpinion();
              if (booking.screening)
                this.initialValues.film = booking.screening.film;
              this.initialValues.user = this.authService.getCurrentUser();
              this.initialValues.bookingId = booking.id;
            } else {
              this.initialValues = response;
              if (booking.screening && booking.screening.film)
                this.title = `${this.title} ${booking.screening.film.title}`;
            }
          })
        )
        .subscribe(() => {
          this.showModal = true;
        });
    }
  };

  onModalClose(finalOpinion: OpinionResponse) {
    this.showModal = false;

    if (finalOpinion) {
      finalOpinion.user = this.initialValues.user;
      finalOpinion.film = this.initialValues.film;

      if (!finalOpinion.id) {
        this.spaceService
          .addOpinion(finalOpinion)
          .pipe(
            tap((response) => {
              this.addBookingOpinionId(response.opinionId, finalOpinion);
            })
          )
          .subscribe();
      } else {
        this.spaceService
          .updateOpinion(finalOpinion)
          .pipe(
            tap((response) => {
              this.updateBookingOpinion(finalOpinion);
            })
          )
          .subscribe();
      }
    }
  }

  addBookingOpinionId(opinionId: number, finalOpinion: OpinionResponse) {
    const bookingToUpdate = this.space.closedBookings.find(
      (booking) => booking.id === this.initialValues.bookingId
    );
    if (bookingToUpdate) {
      bookingToUpdate.opinion = finalOpinion;
      finalOpinion.id = opinionId;
    }

    this.utilsService.presentAlert(
      'Ajout réussi ',
      'Votre avis a été ajouté',
      ['OK'],
      'success'
    );
  }

  updateBookingOpinion(finalOpinion: OpinionResponse) {
    const bookingToUpdate = this.space.closedBookings.find(
      (booking) => booking.opinion?.id === finalOpinion.id
    );
    if (bookingToUpdate) {
      bookingToUpdate.opinion = finalOpinion;
    }

    this.utilsService.presentAlert(
      'Mise à jour réussie ',
      'Votre avis a été mis à jour',
      ['OK'],
      'success'
    );
  }
}
