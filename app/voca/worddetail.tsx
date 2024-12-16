import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAddWordToUserWordList } from '~/queries/hooks/word/useWords';

export default function WordDetailPage() {
  const params = useLocalSearchParams();
  const word = JSON.parse(params.word as string);
  const [wordId] = useState(word.word_id);
  const [isInList, setIsInList] = useState(word.isInUserWordList);

  const toggleWordInList = useAddWordToUserWordList(wordId);

  const handleAddToWordList = async () => {
    try {
      setIsInList(!isInList);
      await toggleWordInList.mutateAsync();
    } catch (error) {
      setIsInList(isInList);
      console.error('단어 추가 실패:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: word.word,
          headerTitleAlign: 'center',
        }}
      />
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold">{word.word}</Text>
          <Text className="mt-1 text-gray-600">{word.part_of_speech}</Text>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">의미</Text>
          <Text className="text-base text-gray-700">{word.meaning_en}</Text>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">예문</Text>
          <Text className="mb-1 text-base">{word.example_sentence}</Text>
          <Text className="text-base text-gray-600">{word.example_translation}</Text>
        </View>

        <TouchableOpacity
          className={`rounded-lg p-4 ${isInList ? 'bg-gray-200' : 'bg-blue-500'}`}
          onPress={handleAddToWordList}
          disabled={toggleWordInList.isPending}>
          <Text className={`text-center font-medium ${isInList ? 'text-gray-700' : 'text-white'}`}>
            {toggleWordInList.isPending
              ? '처리 중...'
              : isInList
                ? '내 단어장에서 제거'
                : '내 단어장에 추가'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
