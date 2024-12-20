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
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import uuid from 'react-native-uuid';

import { useGameQuestions, useSubmitAnswer } from '~/queries/hooks/games/useGameService';

const TIMER_DURATION = 15;

export default function GamePlay() {
  const router = useRouter();
  const { id, level } = useLocalSearchParams<{ id: string; level: string }>();
  const { data: gameQuestions, isLoading } = useGameQuestions(Number(id), Number(level), 10);
  const submitAnswer = useSubmitAnswer();
  const [sessionId] = useState(() => uuid.v4().toString());

  const [gameState, setGameState] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
    currentLevel: 1,
    leveledUp: false,
    experienceGained: 0,
    userLeveledUp: false,
    currentUserLevel: 1,
    lastAnswerCorrect: null,
  });

  console.log('gameState', gameState);

  const [scoreHistory, setScoreHistory] = useState<{ result: string; color: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION); // 매번 새로 시작

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [canAnswer, setCanAnswer] = useState(true);
  const optionScales = useSharedValue(Array(4).fill(1));

  const progress = useSharedValue(1);
  const currentQuestion = gameQuestions?.[currentQuestionIndex];

  const animatedStyles = Array(4)
    .fill(0)
    .map((_, index) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ scale: withSpring(optionScales.value[index]) }],
          opacity: interpolate(optionScales.value[index], [0.95, 1], [0.8, 1]),
        };
      })
    );

  useEffect(() => {
    if (!currentQuestion || isGameOver) return;

    let timer: NodeJS.Timeout;

    // 프로그레스 바와 시간 초기화
    progress.value = 1;
    setTimeLeft(TIMER_DURATION);

    progress.value = withTiming(0, { duration: TIMER_DURATION * 1000 });

    timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer); // 타이머 종료
          if (!isSubmitting && !isGameOver) handleTimeout();
          return 0;
        }
        return prevTimeLeft - 1; // 시간 감소
      });
    }, 1000);

    // 이전 타이머 클리어 (cleanup)
    return () => {
      clearInterval(timer);
    };
  }, [currentQuestionIndex, gameQuestions, isGameOver]);

  const handleTimeout = () => {
    if (!isSubmitting && !isGameOver) {
      updateGameState(false);
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < (gameQuestions?.length || 0) - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setCanAnswer(true);
      }, 1000);
    } else {
      console.log('moveToNextQuestion');
      setTimeout(() => {
        setGameState((currentState) => {
          const finalState = {
            correctAnswers: currentState.correctAnswers,
            totalQuestions: currentState.totalQuestions,
            currentLevel: currentState.currentLevel,
            leveledUp: currentState.leveledUp,
            experienceGained: currentState.experienceGained,
            userLeveledUp: currentState.userLeveledUp,
            currentUserLevel: currentState.currentUserLevel,
          };

          setTimeout(() => {
            const params = new URLSearchParams({
              correctAnswers: finalState.correctAnswers.toString(),
              totalQuestions: finalState.totalQuestions.toString(),
              currentLevel: finalState.currentLevel.toString(),
              leveledUp: finalState.leveledUp.toString(),
              experienceGained: finalState.experienceGained.toString(),
              userLeveledUp: finalState.userLeveledUp.toString(),
              currentUserLevel: finalState.currentUserLevel.toString(),
              gameId: id,
            }).toString();

            setIsGameOver(true);
            router.replace(`/game/result?${params}`);
          }, 0);

          return currentState;
        });
      }, 1000);
    }
  };

  const handleAnswer = async (answer: string | null, optionIndex: number) => {
    if (!currentQuestion || isSubmitting || isGameOver || !canAnswer) return;

    setCanAnswer(false);
    setIsSubmitting(true);

    optionScales.value = optionScales.value.map((scale, idx) =>
      idx === optionIndex ? 0.95 : scale
    );

    try {
      const response = await submitAnswer.mutateAsync({
        gameTypeId: Number(id),
        submitAnswerDto: {
          questionId: currentQuestion.question_id,
          answer: answer || '',
          sessionId,
        },
      });

      console.log(' response - play', JSON.stringify(response, null, 2));

      setLastResponse(response);
      updateGameState(response.isCorrect, response);
      moveToNextQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
      updateGameState(false);
      moveToNextQuestion();
    } finally {
      setIsSubmitting(false);
      optionScales.value = optionScales.value.map(() => 1);
    }
  };

  const updateGameState = (isCorrect: boolean, response?: any) => {
    const resultIcon = isCorrect ? 'check-circle' : 'close-circle';
    const color = isCorrect ? 'green' : 'red';
    setScoreHistory((prev) => [...prev, { result: resultIcon, color }]);

    setGameState((prev): any => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalQuestions: prev.totalQuestions + 1,
      lastAnswerCorrect: isCorrect,
      currentLevel: response?.gameProgress?.currentLevel || prev.currentLevel,
      leveledUp: response?.gameProgress?.leveledUp || false,
      experienceGained: response?.userProgress?.experienceGained || 0,
      userLeveledUp: response?.userProgress?.userLeveledUp || false,
      currentUserLevel: response?.userProgress?.currentUserLevel || prev.currentUserLevel,
    }));
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
              style={[{ height: '100%', backgroundColor: '#7b33ff' }, progressStyle]}
            />
          </View>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Time Left: {timeLeft}s</Text>
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
              <Animated.View key={index} style={[{ width: '48%' }, animatedStyles[index]]}>
                <Pressable
                  style={{
                    backgroundColor: 'orange',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 2,
                    opacity: canAnswer ? 1 : 0.7,
                  }}
                  disabled={!canAnswer}
                  onPress={() => handleAnswer(option, index)}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{option}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
