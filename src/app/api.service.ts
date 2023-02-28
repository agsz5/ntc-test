import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country, City } from './models/population';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3001/';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}countries`).pipe(
      map((countries: Country[]) => {
        return countries.map(country => {
          return {
            name: country.name,
            code: country.code,
            flag: country.flag,
            population: country.population
          };
        });
      })
    );
  }
  
  getCities(countryCode: string): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}cities?country=${countryCode}`).pipe(
      map((cities: City[]) => {
        return cities.map(city => {
          return {
            countrycode: city.countrycode,
            name: city.name,
            capital: city.capital,
            population: city.population
          };
        });
      })
    );
  }

}
