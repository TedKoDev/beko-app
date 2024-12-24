import { create } from 'zustand';

interface Country {
  country_id: number;
  country_name: string;
  country_code: string;
  flag_icon: string;
}

interface CountryState {
  countries: Country[];
  selectedCountry?: Country;
  setCountries: (countries: Country[]) => void;
  setSelectedCountry: (country: Country) => void;
  getCountryByName: (name: string) => Country | undefined;
}

export const useCountryStore = create<CountryState>((set, get) => ({
  countries: [],
  selectedCountry: undefined,

  setCountries: (countries) => {
    set({ countries });
  },

  setSelectedCountry: (country) => {
    set({ selectedCountry: country });
  },

  getCountryByName: (name) => {
    return get().countries.find((country) => country.country_name === name);
  },
}));
