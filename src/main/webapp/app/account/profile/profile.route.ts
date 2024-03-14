import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfileComponent } from './profile.component';

export const profileRoute: Route = {
  path: 'profile',
  component: ProfileComponent,
  data: {
    pageTitle: 'Profile',
  },
  canActivate: [UserRouteAccessService],
};
