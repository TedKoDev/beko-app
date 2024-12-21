import { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { WordItem } from './components/worditem';

import { useAddWordToUserWordList, useWordList } from '~/queries/hooks/word/useWords';

export default function WordListPage() {
  const [wordId, setWordId] = useState(0);
  const [notes, setNotes] = useState('');

  const {
    data: wordList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useWordList();

  //console.log('wordList', JSON.stringify(wordList, null, 2));

  const toggleWordInList = useAddWordToUserWordList(wordId, notes);

  const handleToggleWord = async (wordId: number, currentState: boolean) => {
    //console.log('handleToggleWord called with wordId:', wordId, 'current state:', currentState);
    setWordId(wordId);
    try {
      await toggleWordInList.mutateAsync();
      //console.log('Toggle completed successfully');
    } catch (error) {
      console.error('단어 목록 토글 실패:', error);
    }
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 중복 제거와 함께 데이터 정렬
  const allWords = useMemo(() => {
    //console.log('Recalculating allWords');
    if (!wordList?.pages) {
      //console.log('No pages in wordList');
      return [];
    }

    const words = wordList.pages.reduce((acc, page) => {
      return [...acc, ...page.wordList];
    }, [] as any[]);

    //console.log('Total words:', words.length);

    const uniqueWords = Array.from(new Map(words.map((word) => [word.word_id, word])).values());

    //console.log('Unique words:', uniqueWords.length);
    return uniqueWords;
  }, [wordList?.pages]);

  //console.log('allWords', JSON.stringify(allWords, null, 2));

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allWords}
        keyExtractor={(item, index) => `${item.word_id}-${index}`}
        renderItem={({ item }) => {
          //console.log('Rendering word:', item.word_id, item.isInUserWordList);
          return (
            <WordItem
              item={item}
              isInUserWordList={item.isInUserWordList}
              onToggle={() => handleToggleWord(item.word_id, item.isInUserWordList)}
            />
          );
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
