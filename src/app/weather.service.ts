import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'bb6893c77941e632975c1c78e7a146fd';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  public getWeather(queryParams?: any): Observable<any> {
    queryParams.appid = this.apiKey;
    return this.http.get(this.apiUrl, { params: queryParams });
  }
}
