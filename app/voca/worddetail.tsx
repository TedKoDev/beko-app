import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAddWordToUserWordList, useUpdateUserWordNotes } from '~/queries/hooks/word/useWords';

export default function WordDetailPage() {
  const params = useLocalSearchParams();
  const word = JSON.parse(params.word as string);

  //console.log('word', JSON.stringify(word, null, 2));
  const [wordId] = useState(word.word_id);
  const [notes, setNotes] = useState(word.userNotes || word.notes || '');
  const [isInList, setIsInList] = useState(word.isInUserWordList);
  const updateUserWordNotes = useUpdateUserWordNotes(wordId, notes);

  const toggleWordInList = useAddWordToUserWordList(wordId, notes);

  const handleUpdateNotes = async () => {
    //console.log('handleUpdateNotes called');
    await updateUserWordNotes.mutateAsync();
  };

  const handleAddToWordList = async () => {
    try {
      setIsInList(!isInList);
      await toggleWordInList.mutateAsync();
    } catch (error) {
      setIsInList(isInList);
      console.error('Word addition failed:', error);
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
          <Text className="mb-2 text-lg font-semibold text-gray-800">Meaning</Text>
          <Text className="text-base text-gray-700">{word.meaning_en}</Text>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Example</Text>
          <Text className="mb-1 text-base">{word.example_sentence}</Text>
          <Text className="mb-16 text-base text-gray-600">{word.example_translation}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="mb-2 text-lg font-semibold text-gray-800">Memo</Text>
            {isInList ? (
              <TouchableOpacity onPress={handleUpdateNotes}>
                <Text className="text-blue-500">Save Notes</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <TextInput
            multiline
            className=" h-20 rounded-lg border border-gray-300 p-2 "
            placeholder="when you want to remember this word"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity
          className={`rounded-lg p-4 ${isInList ? 'bg-gray-200' : 'bg-blue-500'}`}
          onPress={handleAddToWordList}
          disabled={toggleWordInList.isPending}>
          <Text className={`text-center font-medium ${isInList ? 'text-gray-700' : 'text-white'}`}>
            {toggleWordInList.isPending
              ? 'Processing...'
              : isInList
                ? 'Remove from my word list'
                : 'Add to my word list'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
