import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'places',
    loadChildren: () => import('./pages/places/places.module').then( m => m.PlacesPageModule)
  },
  {
    path: 'finding',
    loadChildren: () => import('./pages/finding/finding.module').then( m => m.FindingPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'trips',
    loadChildren: () => import('./pages/trips/trips.module').then( m => m.TripsPageModule)
  },
  {
    path: 'trip-detail',
    loadChildren: () => import('./pages/trip-detail/trip-detail.module').then( m => m.TripDetailPageModule)
  },
  {
    path: 'driver',
    loadChildren: () => import('./pages/driver/driver.module').then( m => m.DriverPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./pages/tracking/tracking.module').then( m => m.TrackingPageModule)
  },
  {
    path: 'modal-rating',
    loadChildren: () => import('./pages/modal-rating/modal-rating.module').then( m => m.ModalRatingPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/pets/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'mypets',
    loadChildren: () => import('./pages/pets/mypets/mypets.module').then( m => m.MypetsPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/pets/update/update.module').then( m => m.UpdatePageModule)
  },  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'crear',
    loadChildren: () => import('./pages/paseos/crear/crear.module').then( m => m.CrearPageModule)
  },
  {
    path: 'crear-paseos',
    loadChildren: () => import('./pages/paseos/crear-paseos/crear-paseos.module').then( m => m.CrearPaseosPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
