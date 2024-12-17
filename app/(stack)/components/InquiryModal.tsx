import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { useReport } from '~/queries/hooks/report/useReport';

interface InquiryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isVisible, onClose }: InquiryModalProps) {
  const [reason, setReason] = useState('');
  const { createReport, isLoading } = useReport({
    onSuccess: () => {
      onClose();
      setReason('');
    },
  });

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Alert', 'Please enter your inquiry.');
      return;
    }

    await createReport({
      targetType: 'GENERAL',
      targetId: 0, // GENERAL 타입의 경우 임의의 ID 사용
      reportedUserId: 1, // GENERAL 타입의 경우 임의의 ID 사용
      reason: reason.trim(),
    });
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className="rounded-lg bg-white p-4">
            <Text className="mb-4 text-xl font-bold text-gray-800">Inquiry</Text>

            <TextInput
              className="mb-4 h-32 rounded-lg border border-gray-200 bg-gray-50 p-2 text-base text-gray-800"
              multiline
              placeholder="Please enter your inquiry."
              value={reason}
              onChangeText={setReason}
              textAlignVertical="top"
              editable={!isLoading}
            />

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={onClose}
                disabled={isLoading}
                className="rounded-lg bg-gray-100 px-4 py-2">
                <Text className="text-base text-gray-600">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                className="rounded-lg bg-purple-600 px-4 py-2">
                <Text className="text-base text-white">
                  {isLoading ? 'Processing...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
