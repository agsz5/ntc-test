import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Country, City } from '../models/population';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectionList } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatChip,  MatChipOption, MatChipInputEvent } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';



@Component({
  selector: 'app-country-city',
  templateUrl: './country-city.component.html',
  styleUrls: ['./country-city.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CountryCityComponent implements OnInit {
  sliderStep = 1;
  countries: any[] = [];
  filteredCountries: any[] = [];
  cities: any[] = [];
  populationFilter: number | null = null;
  selectedCountry: string | null = null;
  selectedCountryCode: string | null = null;
  selectedCountryPopulation: number | null = null;
  countryControl = new FormControl();
  populationRange: number[] = [0, 0];
  maxPopulation: number = 0;
  sliderValue: number = 1;
  sliderValueMin: number = 1;
  sliderValueMax: number = 0;
  
  @ViewChild(MatAutocompleteTrigger, {static: false}) autocomplete!: MatAutocompleteTrigger;
  @ViewChild(MatSelectionList) selectionList!: MatSelectionList;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('minChip') minChip!: MatChipOption;
  @ViewChild('maxChip') maxChip!: MatChipOption;

  dataSource = new MatTableDataSource<Country>();
  displayedColumns: string[] = ['name', 'population', 'code', 'flag'];

  cityDataSource = new MatTableDataSource<City>();
  cityDisplayedColumns: string[] = ['name', 'population'];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getCountries().subscribe((countries: any[]) => {
      this.countries = [
        { name: 'ALL', code: 'ALL', population: null, flag: null },
        ...countries
      ];
      this.filteredCountries = this.countries;
      this.dataSource.data = this.countries.slice(1);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selectedCountryPopulation = null;
      // Calculate the maximum population value
      this.maxPopulation = Math.max(...countries.map(c => c.population));
      this.sliderValueMax = this.maxPopulation;
    });
    this.countryControl.valueChanges.subscribe(value => {
      if (value && this.countries) {
        this.filteredCountries = this.countries.filter(country => {
          return country.name.toLowerCase().includes(value.toLowerCase());
        });
      }
    });
  }
  
  getCities(countryCode: string) {
    const country = this.countries.find(c => c.code === countryCode);
    this.selectedCountry = country ? country.name : null;
    this.selectedCountryCode = country ? country.code : null;
    this.selectedCountryPopulation = country ? country.population : null;
    this.apiService.getCities(countryCode).subscribe((cities: any[]) => {
      this.cities = cities;
      this.cityDataSource.data = cities;
    });
  }

  selectCountry(event: any) {
    const countryCode = event.option.value;
    this.getCities(countryCode);
  }

  selectTopCountry() {
    const topCountry = this.filteredCountries[0];
    if (topCountry) {
      this.countryControl.setValue(topCountry.name);
      this.autocomplete.closePanel();
      this.getCities(topCountry.code);
    }
  }

  setFirstOptionActive() {
    setTimeout(() => {
      const options = document.querySelectorAll('.mat-option');
      if (options.length > 0) {
        options[0].classList.add('mat-active');
      }
    });
  }

  onMinSizeChipClick(){
    this.sliderValueMin = 1;
    this.filterBySliderValues();
    if (this.maxChip?._elementRef?.nativeElement) {
      this.maxChip.select();
    }
  }

  onMaxSizeChipClick(){
    this.sliderValueMax = this.maxPopulation;
    this.filterBySliderValues();
    if (this.minChip?._elementRef?.nativeElement) {
      this.minChip.select();
    }
  }

  filterBySliderValues() {
    if (this.sliderValueMin === 1 && this.sliderValueMax === this.maxPopulation) {
      // If the slider is at its minimum and maximum values, show all countries
      this.dataSource.data = this.countries.slice(1);
    } else {
      const filteredCountries = this.countries.filter(country => {
        return country.population >= this.sliderValueMin && country.population <= this.sliderValueMax;
      });
      this.paginator.pageIndex = 0;
      this.dataSource.data = filteredCountries;
    }
  }
  
  formatLabel(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    } else {
      return value.toString();
    }
  }

  formatPopulationValue(value: number | null): string {
    if (value === null) {
      return 'N/A';
    }
    return value.toLocaleString('en-US');
  }

  resetSelection() {
    this.sliderValueMin = 1;
    this.sliderValueMax = this.maxPopulation;
    this.sliderValue = 1;
    this.selectedCountry = null;
    this.cities = [];
    this.countryControl.reset();
    this.filteredCountries = this.countries;
    this.paginator.pageIndex = 0;
    this.dataSource.data = this.countries.slice(1);

    const options = this.autocomplete.autocomplete.options.toArray();
    options.forEach((option) => {
      option.deselect();
    });
  
    const activeCheck = document.querySelectorAll('mat-pseudo-checkbox');
    activeCheck.forEach(activeCheck => {
      activeCheck.classList.remove('mat-pseudo-checkbox-checked');
    });

  }

}
