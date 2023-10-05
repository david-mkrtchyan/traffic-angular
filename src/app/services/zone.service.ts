import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Zone } from "../page-components/interfaces/zone";
import { environment } from "../../environments/environment";
import { Params } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  constructor(private http: HttpClient) {
  }

  public getZones(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/zone`);
  }

  public getZone(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/zone/${id}`);
  }

  public createZone(params: Params): Observable<any> {
    return this.http.post(`${environment.apiUrl}/zone`, params);
  }

  public deleteZone(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/zone/${id}`);
  }
}
