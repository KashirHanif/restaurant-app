import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function UserTabs() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName = '';

        switch (route.name) {
          case 'user-menu':
            iconName = 'restaurant';
            break;
          case 'user-cart':
            iconName = 'cart';
            break;
          case 'user-order':
            iconName = 'receipt';
            break;
          case 'user-profile':
            iconName = 'person';
            break;
          default:
            iconName = 'ellipse'; // fallback icon
        }

        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: '#6a994e',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          paddingBottom: 20,  // increased padding bottom for thickness
          paddingTop: 16,     // increased padding top
          height: 90, 
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        };
      }}
    >
      <Tabs.Screen name="user-menu" options={{ title: 'Menu' }} />
      <Tabs.Screen name="user-cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="user-order" options={{ title: 'Orders' }} />
      <Tabs.Screen name="user-profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
