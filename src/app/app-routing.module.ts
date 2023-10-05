import { RouterModule, Routes } from '@angular/router';
import { ZoneComponent } from './page-components/zone/zone.component';
import { MapComponent } from './page-components/map/map.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'zone',
    pathMatch: 'full'
  },
  {
    path: 'zone',
    component: ZoneComponent
  },
  {
    path: 'map/:zoneId',
    component: MapComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
