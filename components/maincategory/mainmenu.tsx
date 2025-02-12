import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import JobIcon from '../../assets/icons/job.svg';
import SchoolIcon from '../../assets/icons/school.svg';
import TopicTestIcon from '../../assets/icons/topictest.svg';
import TravelIcon from '../../assets/icons/travel.svg';
import ContractIcon from '../../assets/icons/contract.svg';
import VocaIcon from '../../assets/icons/voca.svg';
import { useRouter } from 'expo-router';

interface MenuItemProps {
  color: string;
  label: string;
  route: string;
  type?: string;
  icon: React.FC<any>;
}

const MenuItem: React.FC<MenuItemProps> = ({ color, label, route, type, icon: Icon }) => {
  const router = useRouter();

  const handlePress = () => {
    if (type) {
      router.push({
        pathname: route,
        params: { type },
      } as any);
    } else {
      router.push(route as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        alignItems: 'center',
        marginHorizontal: 8,
        marginTop: 20,
      }}>
      <View
        style={{
          backgroundColor: color,
          width: 45,
          height: 45,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon width={30} height={30} />
      </View>
      <Text
        style={{
          color: '#000000',
          fontSize: 12,
          marginTop: 6,
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const MainMenu = () => {
  const menuItems = [
    { color: '#ADD8FF', label: 'VOCA', route: '/voca/vocaindex', icon: VocaIcon },
    {
      color: '#D1B3FF',
      label: 'TOPIK',
      route: '/ad',
      type: 'ads',
      icon: TopicTestIcon,
    },
    { color: '#FFCCFF', label: 'SCHOOL', route: '/(stack)/koreanschools', icon: SchoolIcon },
    { color: '#FFEB3B', label: 'JOB', route: '/ad', type: 'ads', icon: JobIcon },
    {
      color: '#00FFCC',
      label: 'CHATBOT',
      route: '/(stack)/chatbot',
      type: 'chatbot',
      icon: TravelIcon,
    },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        width: '100%',
      }}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          color={item.color}
          label={item.label}
          route={item.route}
          type={item.type}
          icon={item.icon}
        />
      ))}
    </View>
  );
};

export default MainMenu;
