import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() firstName?: string;
  @Input() lastName?: string;

  get initials() {
    return (this.firstName?.[0] ?? '') + this.lastName?.[0];
  }
}
