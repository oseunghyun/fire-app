import { Tabs } from 'expo-router';
import React from 'react';

import { SpriteIcon } from '@/components/fire-ui';
import { HapticTab } from '@/components/haptic-tab';
import { palette } from '@/constants/fire-theme';
import { fontFamily } from '@/constants/typography';

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
          fontFamily: fontFamily.bodyStrong,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: () => <SpriteIcon name="fire" size={28} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: '트래킹',
          tabBarIcon: () => <SpriteIcon name="goal" size={28} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: '피드',
          tabBarIcon: () => <SpriteIcon name="report" size={28} />,
        }}
      />
      <Tabs.Screen
        name="crew"
        options={{
          title: '크루',
          tabBarIcon: () => <SpriteIcon name="crew" size={28} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: '리포트',
          tabBarIcon: () => <SpriteIcon name="rocket" size={28} />,
        }}
      />
    </Tabs>
  );
}
