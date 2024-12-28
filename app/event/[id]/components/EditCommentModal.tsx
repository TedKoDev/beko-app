import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface EditCommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  initialContent: string;
}

export default function EditCommentModal({
  visible,
  onClose,
  onSubmit,
  initialContent,
}: EditCommentModalProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      onClose();
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          padding: 20,
        }}>
        <View className="rounded-lg bg-white p-4">
          <Text className="mb-4 text-lg font-bold">Edit Comment</Text>
          <TextInput
            className="mb-4 rounded-lg border border-gray-200 p-2"
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={(text) => {
              if (text.length <= 200) {
                setContent(text);
              }
            }}
            autoFocus
          />
          <Text className="mt-1 text-right text-sm text-gray-500">
            {content.length}/{200}
          </Text>
          <View className="flex-row justify-end gap-2">
            <TouchableOpacity onPress={onClose} className="rounded-lg bg-gray-200 px-4 py-2">
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="rounded-lg bg-purple-custom px-4 py-2">
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
