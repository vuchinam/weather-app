import { Component, OnInit } from '@angular/core';

import { WeatherService } from 'src/app/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  myWeather: any;
  hightTemp: number = 0;
  lowTemp: number = 0;
  humidity: number = 0;
  desc: string = '';
  iconURL: string = '';

  // change city and units
  // called in getWeather()
  city: any = 'vietnam';
  units: string = 'metric';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.getWeather(this.city, this.units).subscribe({
      next: (res) => {
        console.log(res);
        this.myWeather = res;
        console.log(this.myWeather);
        this.hightTemp = this.myWeather.main.temp_max;
        this.lowTemp = this.myWeather.main.temp_min;
        this.humidity = this.myWeather.main.humidity;
        this.desc = this.myWeather.weather[0].description;

        this.iconURL =
          'https://openweathermap.org/img/wn/' +
          this.myWeather.weather[0].icon +
          '@2x.png';
      },
      error: (error) => console.log(error.message),
      complete: () => console.log('API call completed'),
    });
  }
}
