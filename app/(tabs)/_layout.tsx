import { Tabs } from 'expo-router';
import React from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HapticTab } from '@/components/haptic-tab';
import { palette } from '@/constants/fire-theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarStyle: {
          backgroundColor: palette.paper,
          borderTopWidth: 0,
          height: 92,
          paddingTop: 10,
          paddingBottom: 22,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="home-filled" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: '트래킹',
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="show-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: '피드',
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="edit-note" color={color} />,
        }}
      />
      <Tabs.Screen
        name="crew"
        options={{
          title: '크루',
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="groups" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: '리포트',
          tabBarIcon: ({ color }) => <MaterialIcons size={26} name="auto-awesome" color={color} />,
        }}
      />
    </Tabs>
  );
}
