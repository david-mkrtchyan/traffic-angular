import { Component, OnDestroy, OnInit } from '@angular/core';
import { ZoneService } from '../../services/zone.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject, switchMap } from 'rxjs';
import { Zone } from "../interfaces/zone";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  public zone$!: Observable<any>;

  private destroy$ = new Subject<boolean>()
  private map: any;

  constructor(
    private readonly zoneService: ZoneService,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.subscribeToRouterParams();
  }

  private subscribeToRouterParams(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => this.zoneService.getZone(params['zoneId']))
      )
      .subscribe((res: Zone) => {
        const cords = res.points.map((point: number[]) => {
          return {
            lat: +point[0],
            lng: +point[1]
          }
        })

        this.initMap(cords)
        console.log(cords);
      })
  }

  initMap(cords: {lat: number, lng: number}[]) {
    const element = document.getElementById("map");
    if (element) {
      this.map = new google.maps.Map(element, {
        zoom: 5,
        center: {lat: cords[0].lat, lng: cords[0].lng},
        mapTypeId: "terrain",
      });

      const triangleCoords = cords;

      const bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });

      bermudaTriangle.setMap(this.map);

      this.map.addListener('click', this.drawPolygon.bind(this));
    }
  }

  drawPolygon() {
    let isClosed = false;
    let poly = new google.maps.Polyline({ map: this.map, path: [], strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 2 });

    google.maps.event.addListener(this.map, 'click', (clickEvent: any) => {
      if (isClosed)
        return;
      let ployPath: any = poly.getPath();
      let markerIndex = ployPath['length'];
      let isFirstMarker = markerIndex === 0;
      let marker = new google.maps.Marker({ map: this.map, position: clickEvent.latLng, draggable: true });
      if (isFirstMarker) {
        google.maps.event.addListener(marker, 'click', () => {
          if (isClosed)
            return;
          let path = poly.getPath();
          poly.setMap(null);
          poly = new google.maps.Polygon({ map: this.map, paths: path, strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#FF0000", fillOpacity: 0.35 });
          isClosed = true;
        });
      }
      google.maps.event.addListener(marker, 'drag', (dragEvent: any) => {
        poly.getPath().setAt(markerIndex, dragEvent.latLng);
      });
      poly.getPath().push(clickEvent.latLng);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
