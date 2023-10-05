import { Component, OnDestroy, OnInit } from '@angular/core';
import { ZoneService } from '../../services/zone.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Zone } from '../interfaces/zone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit, OnDestroy {
  public zones$!: Observable<any>;
  private destroy$ = new Subject<boolean>()

  constructor(
    private readonly router: Router,
    private readonly zoneService: ZoneService
  ) {
  }

  ngOnInit() {
    this.getZones();
  }

  public getZones(): void {
    this.zones$ = this.zoneService.getZones();
  }

  public navigateToMap(zone: Zone): void {
    this.router.navigate(['/map', zone.id])
  }

  public removeZone(zone: Zone, zones: Zone[]): void {
    this.zoneService.deleteZone(zone.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: {message: string}) => {
        const index = zones.findIndex((item: Zone) => item.id === zone.id);
        index > -1 ? zones.splice(index,1) : null;
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
