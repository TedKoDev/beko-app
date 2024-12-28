import { Link } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { BekoIcon } from '~/assets/icons';

interface AdItem {
  id: number;
  company_name: string;
  description: string;
  image_url: string;
  link?: string | null;
  created_at: string;
}

interface AdListProps {
  items: AdItem[];
}

const AdList: React.FC<AdListProps> = ({ items }) => {
  return (
    <View className="flex-1 p-2">
      {items.map((item) => (
        <Link key={item.id} href={`/event/${item.id}`} asChild>
          <TouchableOpacity className="mb-3 overflow-hidden rounded-lg border border-gray-300 bg-white shadow">
            <Image
              source={item.image_url ? { uri: item.image_url } : BekoIcon}
              className="h-16 w-full"
              resizeMode="cover"
            />
            <View className="p-2">
              <Text className="text-md mb-1 font-bold text-gray-800" numberOfLines={1}>
                {item.company_name}
              </Text>
              <Text className="mb-1 text-sm text-gray-600" numberOfLines={2} ellipsizeMode="tail">
                {item.description}
              </Text>
              <Text className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
};

export default AdList;
