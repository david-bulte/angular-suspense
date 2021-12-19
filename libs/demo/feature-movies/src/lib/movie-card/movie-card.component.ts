import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from '../movie.service';

@Component({
  selector: 'demo-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  @Output() selectActor = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}
}
