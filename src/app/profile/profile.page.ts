import { Recipe } from '../models/recipe.model';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail} from '@ionic/core';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  dataLoaded = new Subject<User[]>();
  recipesSaved: Recipe[];
  isSettingsOpen = false;

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  // the use of buttons segments to change infomation view in the same page
  onFilter(event: CustomEvent<SegmentChangeEventDetail>) {
    this.isSettingsOpen = !this.isSettingsOpen;
    console.log(event.detail);
  }

  showUserName() {
    const name = this.authService.getUserName();
    console.log(name);
  }

}
