import { Component, Input } from '@angular/core';

@Component({
  selector: 'demo-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  @Input() firstName?: string;
  @Input() lastName?: string;

  get initials() {
    return (this.firstName?.[0] ?? '') + this.lastName?.[0];
  }
}
