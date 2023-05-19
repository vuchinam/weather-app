import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/internal/operators/pluck';

import { WeatherService } from 'src/app/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  res: any;
  myDate = new Date();
  iconURL: string = '';
  weatherData: any = [];
  desc: any = '';
  temp: any = '';
  tempMax: number = 0;
  tempMin: number = 0;
  humidity: number = 0;
  windSpeed: number = 0;
  nameCity: string = '';
  nameCountry: string = '';
  cities: any = ['Japan', 'Korea', 'China', 'Canada', 'Thailand'];

  selected = 'Japan';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWeather();
    // get day weather
    this.weatherService
      .getWeather()
      .pipe(pluck('list'))
      .subscribe((data) => {
        this.futureForecast(data);
      });
    this.handleClick(this.cities);
  }

  //vòng lặp lấy ra từng ngày
  futureForecast(data: any): void {
    for (let i = 0; i < data.length; i = i + 8) {
      this.weatherData.push(data[i]);
    }
  }

  getWeather(): void {
    this.weatherService.getWeather().subscribe((data) => {
      this.res = data;

      if (data && data.list) {
        this.myDate = this.res.list[0].dt_txt;
        this.iconURL =
          'http://openweathermap.org/img/wn/' +
          this.res.list[0].weather[0].icon +
          '@2x.png';
        this.desc = this.res.list[0].weather[0].description;

        this.temp = this.res.list[0].main.temp;
        this.tempMax = this.res.list[0].main.temp_max;
        this.tempMin = this.res.list[0].main.temp_min;

        this.humidity = this.res.list[0].main.humidity;
        this.windSpeed = this.res.list[0].wind.speed;

        this.nameCity = this.res.city.name;
        this.nameCountry = this.res.city.country;
      }
    });
  }

  handleClick(e: any) {
    let cities = Array.from(this.cities);
    cities = e.target?.value;

    this.weatherService.updateCityName(cities);
  }
}
