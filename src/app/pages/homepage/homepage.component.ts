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

  cities: any = ['Japan', 'Korea', 'China', 'Canada', 'Thailand'];

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

  getWeatherResponse(response: any): void {
    if (response?.list?.length) {
      const { city, cnt, cod, list, message } = response;
      const {
        dt_txt,
        weather,
        main: { temp, temp_max, temp_min, humidity },
        wind,
      } = list[0];

      const weatherNext5Days = this.getForecastNext5Days(list).slice(0, 5);

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
        weatherData: weatherNext5Days,
      };
    }
  }

  private getForecastNext5Days(forecastList: any[]): any[] {
    const result: any[] = [];
    forecastList.forEach((forecast, i) => {
      const nextForecast = forecastList[i + 1];
      const prevDay = new Date(forecast.dt_txt);
      const nextDay = new Date(nextForecast?.dt_txt);
      // Checking if the next day in list which is the next day of the current checking day
      if (
        nextForecast &&
        nextDay.getDate() === prevDay.getDate() + 1 &&
        nextDay.getHours() === 0
      ) {
        result.push(nextForecast);
      }
    });
    console.log('getForecastNext5Days', result);
    return result;
  }
}
