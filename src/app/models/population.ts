export interface Country {
    code: string;
    flag: string;
    name: string;
    population: number;
  }
  
  export interface City {
    countrycode: string;
    name: string;
    capital: string;
    population: number;
  }