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
    lastAnswerCorrect: null,
  });

  console.log('gameState', gameState);

  const [scoreHistory, setScoreHistory] = useState<{ result: string; color: string }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
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
    if (gameQuestions?.length > 0) {
      progress.value = 1;
      progress.value = withTiming(0, { duration: TIMER_DURATION * 1000 });

      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(timer);
            if (!isSubmitting && !isGameOver) handleTimeout();
            return 0;
          }
          return prevTimeLeft - 1; // 수정된 부분
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
          };

          setTimeout(() => {
            const params = new URLSearchParams({
              correctAnswers: finalState.correctAnswers.toString(),
              totalQuestions: finalState.totalQuestions.toString(),
              currentLevel: '1',
              leveledUp: 'false',
              experienceGained: '0',
              userLeveledUp: 'false',
              currentUserLevel: '1',
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

    // 클릭 애니메이션
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

      setLastResponse(response);
      updateGameState(response.isCorrect);
      moveToNextQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
      updateGameState(false);
      moveToNextQuestion();
    } finally {
      setIsSubmitting(false);
      // 애니메이션 복구
      optionScales.value = optionScales.value.map(() => 1);
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
              style={[{ height: '100%', backgroundColor: '#6C47FF' }, progressStyle]}
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
