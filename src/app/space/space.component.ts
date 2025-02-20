import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SpaceComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
