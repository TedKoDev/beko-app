// components/WordItem.tsx
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type WordItemProps = {
  item: {
    word_id: number;
    word: string;
    part_of_speech: string;
    meaning_en: string;
    example_sentence: string;
    example_translation: string;
    isInUserWordList: boolean;
    notes: string;
  };
};

export default function WordItem({ item }: WordItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/voca/worddetail',
      params: { word: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between border-b border-gray-200 p-4 active:bg-gray-50"
      onPress={handlePress}>
      <View className="flex-row items-center">
        <Text className="mr-2 text-base font-medium">{item.word}</Text>
        <Text className="text-sm text-gray-500">{item.part_of_speech}</Text>
      </View>
      <Icon
        name={item.isInUserWordList ? 'check-circle' : 'check-circle-outline'}
        size={24}
        color={item.isInUserWordList ? '#4CAF50' : '#CCCCCC'}
      />
    </TouchableOpacity>
  );
}
