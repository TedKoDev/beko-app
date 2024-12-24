import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { useCountryStore } from '~/store/countryStore';

interface SchoolFilterProps {
  selectedCountryCode?: string;
  selectedRegion?: string;
  setSelectedCountryCode: (code: string | undefined) => void;
  setSelectedRegion: (region: string | undefined) => void;
  regions?: string[]; // 선택된 국가의 지역 목록
}

export const SchoolFilter: React.FC<SchoolFilterProps> = ({
  selectedCountryCode,
  selectedRegion,
  setSelectedCountryCode,
  setSelectedRegion,
  regions,
}) => {
  const { countries } = useCountryStore();

  return (
    <View className="bg-white">
      <View className="bg-white py-4">
        {/* Countries */}
        <View>
          <Text className="mb-2 pl-4 text-gray-600">Country</Text>
          <ScrollView className="pl-4" horizontal showsHorizontalScrollIndicator={false}>
            <View className="mr-6 flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  setSelectedCountryCode(undefined);
                  setSelectedRegion(undefined);
                }}
                className={`rounded-xl px-4 py-2 ${
                  selectedCountryCode === undefined ? 'bg-purple-custom' : 'bg-gray-200'
                }`}>
                <Text
                  className={selectedCountryCode === undefined ? 'text-white' : 'text-gray-700'}>
                  All
                </Text>
              </TouchableOpacity>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.country_code}
                  onPress={() => {
                    setSelectedCountryCode(country.country_code);
                    setSelectedRegion(undefined);
                  }}
                  className={`rounded-xl px-4 py-2 ${
                    selectedCountryCode === country.country_code
                      ? 'bg-purple-custom'
                      : 'bg-gray-200'
                  }`}>
                  <Text
                    className={
                      selectedCountryCode === country.country_code ? 'text-white' : 'text-gray-700'
                    }>
                    {country.country_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Regions */}
        {selectedCountryCode && regions && regions.length > 0 && (
          <View className="mt-4">
            <Text className="mb-2 pl-4 text-gray-600">Region</Text>
            <ScrollView className="pl-4" horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setSelectedRegion(undefined)}
                  className={`rounded-xl px-4 py-2 ${
                    selectedRegion === undefined ? 'bg-purple-custom' : 'bg-gray-200'
                  }`}>
                  <Text className={selectedRegion === undefined ? 'text-white' : 'text-gray-700'}>
                    All
                  </Text>
                </TouchableOpacity>
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region}
                    onPress={() => setSelectedRegion(region)}
                    className={`rounded-xl px-4 py-2 ${
                      selectedRegion === region ? 'bg-purple-custom' : 'bg-gray-200'
                    }`}>
                    <Text className={selectedRegion === region ? 'text-white' : 'text-gray-700'}>
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};
