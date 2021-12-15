import { Component, Input } from '@angular/core';

@Component({
  selector: 'demo-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  @Input() givenName!: string;
  @Input() lastName!: string;

  get initials() {
    return this.givenName?.[0] + this.lastName?.[0];
  }
}
