import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-space',
  templateUrl: './space.page.html',
  styleUrls: ['./space.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SpacePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
