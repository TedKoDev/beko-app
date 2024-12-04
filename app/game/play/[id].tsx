import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  SafeAreaView,
  // TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import uuid from 'react-native-uuid';

import { useGameQuestions, useSubmitAnswer } from '~/queries/hooks/games/useGameService';

const TIMER_DURATION = 30;

export default function GamePlay() {
  const router = useRouter();
  const { id, level } = useLocalSearchParams<{ id: string; level: string }>();
  const { data: gameQuestions, isLoading } = useGameQuestions(Number(id), Number(level), 10);
  const submitAnswer = useSubmitAnswer();
  const [sessionId] = useState(() => uuid.v4().toString());

  const [gameState, setGameState] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
    lastAnswerCorrect: null,
  });
  const [scoreHistory, setScoreHistory] = useState<{ result: string; color: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const progress = useSharedValue(1);
  const currentQuestion = gameQuestions?.[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion || isGameOver) return;

    let timer: NodeJS.Timeout;
    if (gameQuestions?.length > 0) {
      progress.value = 1;
      progress.value = withTiming(0, { duration: TIMER_DURATION * 1000 });
      setTimeLeft(TIMER_DURATION);

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (!isSubmitting && !isGameOver) handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [currentQuestionIndex, gameQuestions, isGameOver]);

  const handleTimeout = () => {
    if (!isSubmitting && !isGameOver) {
      updateGameState(false);
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < (gameQuestions?.length || 0) - 1) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 1000);
    } else {
      handleGameOver();
    }
  };

  const handleAnswer = async (answer: string | null) => {
    if (!currentQuestion || isSubmitting || isGameOver) return;

    setIsSubmitting(true);
    console.log('Submitting answer with sessionId:', sessionId);

    try {
      const response = await submitAnswer.mutateAsync({
        gameTypeId: Number(id),
        submitAnswerDto: {
          questionId: currentQuestion.question_id,
          answer: answer || '',
          sessionId,
        },
      });

      setLastResponse(response);
      updateGameState(response.isCorrect);
      moveToNextQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
      updateGameState(false);
      moveToNextQuestion();
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGameState = (isCorrect: boolean) => {
    const resultIcon = isCorrect ? 'check-circle' : 'close-circle';
    const color = isCorrect ? 'green' : 'red';

    setScoreHistory((prev) => [...prev, { result: resultIcon, color }]);
    setGameState((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalQuestions: prev.totalQuestions + 1,
      lastAnswerCorrect: isCorrect,
    }));
  };

  const handleGameOver = () => {
    setIsGameOver(true);

    if (!lastResponse) {
      const params = new URLSearchParams({
        correctAnswers: gameState.correctAnswers.toString(),
        totalQuestions: gameState.totalQuestions.toString(),
        currentLevel: '1',
        leveledUp: 'false',
        experienceGained: '0',
        userLeveledUp: 'false',
        currentUserLevel: '1',
        gameId: id, // 게임 ID 추가
      }).toString();

      router.replace(`/game/result?${params}`);
      return;
    }

    const params = new URLSearchParams({
      correctAnswers: gameState.correctAnswers.toString(),
      totalQuestions: gameState.totalQuestions.toString(),

      currentLevel: lastResponse.gameProgress.currentLevel.toString(),
      leveledUp: lastResponse.gameProgress.leveledUp.toString(),
      experienceGained: lastResponse.userProgress.experienceGained.toString(),
      userLeveledUp: lastResponse.userProgress.userLeveledUp.toString(),
      currentUserLevel: lastResponse.userProgress.currentUserLevel.toString(),
      gameId: id, // 게임 ID 추가
    }).toString();

    router.replace(`/game/result?${params}`);
  };
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (isLoading || !currentQuestion) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
        }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: `Level ${Number(level)}`,
          headerTitleAlign: 'center',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View
          style={{
            padding: 16,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOpacity: 0.1,
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {scoreHistory.map((entry, index) => (
                <MaterialCommunityIcons
                  key={index}
                  name={entry.result}
                  color={entry.color}
                  size={24}
                />
              ))}
            </View>
            <Text>
              Question {currentQuestionIndex + 1}/{gameQuestions?.length || 0}
            </Text>
          </View>
          <View style={{ marginTop: 8, height: 4, backgroundColor: '#e0e0e0', borderRadius: 2 }}>
            <Animated.View
              style={[{ height: '100%', backgroundColor: '#6C47FF' }, progressStyle]}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <Image
              source={{ uri: currentQuestion.image_url }}
              style={{ width: 200, height: 200, borderRadius: 16 }}
            />
          </View>
          <View
            style={{
              padding: 10,
              paddingBottom: Platform.OS === 'android' ? 100 : 8,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {currentQuestion.options.map((option, index) => (
              <Pressable
                key={index}
                style={{
                  width: '48%',
                  backgroundColor: 'orange',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 2,
                }}
                onPress={() => handleAnswer(option)}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
