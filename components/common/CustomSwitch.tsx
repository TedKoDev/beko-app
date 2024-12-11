import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Animated, Easing } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function CustomSwitch({
  value,
  onValueChange,
  disabled = false,
}: CustomSwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 21 : 0)).current;
  const backgroundColorAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 병렬로 실행되는 애니메이션
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: value ? 21 : 0,
        duration: 1000,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: value ? 1 : 0,
        duration: 1000,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  }, [value]);

  const handlePress = () => {
    if (!disabled && !isAnimating) {
      setIsAnimating(true);
      onValueChange(!value);
    }
  };

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(209, 213, 219)', 'rgb(255, 107, 108)'], // gray-300 to #FF6B6C
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className={`h-[35px] w-[55px] rounded-full p-[2px] ${disabled ? 'opacity-50' : ''}`}>
      <Animated.View
        style={{
          backgroundColor,
          borderRadius: 999,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
      <Animated.View
        className="h-[26px] w-[26px] rounded-full bg-white shadow-sm"
        style={{
          transform: [{ translateX }],
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      />
    </TouchableOpacity>
  );
}
