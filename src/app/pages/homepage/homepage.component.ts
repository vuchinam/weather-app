import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';

import { WeatherService } from 'src/app/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  cityUpdater = new BehaviorSubject('Japan');
  subscription!: Subscription;
  data!: any;
  // res: any;
  // myDate = new Date();
  // iconURL: string = '';
  // weatherData: any = [];
  // desc: any = '';
  // temp: any = '';
  // tempMax: number = 0;
  // tempMin: number = 0;
  // humidity: number = 0;
  // windSpeed: number = 0;
  // nameCity: string = '';
  // nameCountry: string = '';
  cities: any = ['Japan', 'Korea', 'China', 'Canada', 'Thailand'];

  // selected = 'Japan';

  constructor(private readonly weatherService: WeatherService) {}

  ngOnInit(): void {
    this.subscription = this.cityUpdater
      .pipe(
        switchMap((selectedCity: string) => {
          console.log('emit new data from Subject selectedCity:', selectedCity);
          const queryParams = { units: 'metric', q: selectedCity };
          console.log('queryParams', queryParams);
          return this.weatherService.getWeather(queryParams);
        })
      )
      .subscribe((res: any) => {
        console.log('response from API:', res);
        this.getWeatherResponse(res);
      });
  }

  handleClick(e: any) {
    const selectedCity = e.target.value;
    console.log('handleClick', 'selectedCity', selectedCity);
    this.cityUpdater.next(selectedCity);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //vòng lặp lấy ra từng ngày
  // futureForecast(data: any): void {
  //   for (let i = 0; i < data.length; i = i + 8) {
  //     this.weatherData.push(data[i]);
  //   }
  // }

  getWeatherResponse(response: any): void {
    if (response?.list?.length) {
      const { city, cnt, cod, list, message } = response;
      const {
        dt_txt,
        weather,
        main: { temp, temp_max, temp_min, humidity },
        wind,
      } = list[0];
      this.data = {
        myDate: dt_txt,
        iconURL: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
        desc: weather[0].description,
        temp,
        tempMax: temp_max,
        tempMin: temp_min,
        humidity,
        windSpeed: wind.speed,
        nameCity: city.name,
        nameCountry: city.country,
      };
    }
    // this.res = data;

    // if (data && data.list) {
    //   this.myDate = this.res.list[0].dt_txt;
    //   this.iconURL =
    //     'http://openweathermap.org/img/wn/' +
    //     this.res.list[0].weather[0].icon +
    //     '@2x.png';
    //   this.desc = this.res.list[0].weather[0].description;

    //   this.temp = this.res.list[0].main.temp;
    //   this.tempMax = this.res.list[0].main.temp_max;
    //   this.tempMin = this.res.list[0].main.temp_min;

    //   this.humidity = this.res.list[0].main.humidity;
    //   this.windSpeed = this.res.list[0].wind.speed;

    //   this.nameCity = this.res.city.name;
    //   this.nameCountry = this.res.city.country;
  }
}
