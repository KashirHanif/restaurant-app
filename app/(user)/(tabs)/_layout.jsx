import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function UserTabs() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'user-menu') {
            iconName = 'restaurant';
          } else if (route.name === 'user-order') {
            iconName = 'receipt';
          } else if (route.name === 'user-profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6a994e',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="user-menu" options={{ title: 'Menu' }} />
      <Tabs.Screen name="user-order" options={{ title: 'Orders' }} />
      <Tabs.Screen name="user-profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
