import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  cities = 'Korea';
  apiKey = 'bb6893c77941e632975c1c78e7a146fd';
  units = 'metric';
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${this.cities}&appid=${this.apiKey}&units=${this.units}`;

  constructor(private http: HttpClient) {}

  public getWeather(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  public updateCityName(newName: any) {
    this.http.get(this.apiUrl).subscribe((cities: any) => {
      cities.name = newName;

      this.http.put(this.apiUrl, cities).subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            console.log(`Error status: ${error.status}`);
            console.log(`Error message: ${error.message}`);
          } else {
            console.log(`Error message: ${error.message}`);
          }
        }
      );
    });
  }
}
