import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'admin-home') {
            iconName = 'home';
          } else if (route.name === 'menu') {
            iconName = 'restaurant';
          } else if (route.name === 'admin-profile') {
            iconName = 'person';
          } else if (route.name === 'admin-order') {
            iconName = 'receipt'; // icon representing orders
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6a994e',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="admin-home" options={{ title: 'Home' }} />
      <Tabs.Screen name="admin-order" options={{ title: 'Order' }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
      <Tabs.Screen name="admin-profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
