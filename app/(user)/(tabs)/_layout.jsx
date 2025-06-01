import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useCartStore } from '../../../stores/useCartStore';
import { useOrderStore } from '../../../stores/useOrderStore';

export default function UserTabs() {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderCount = useOrderStore((state) => state.orders.length);

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
            iconName = 'ellipse';
        }

        return {
          tabBarIcon: ({ color, size }) => {
            let badgeCount = 0;

            if (route.name === 'user-cart') {
              badgeCount = cartCount;
            } else if (route.name === 'user-order') {
              badgeCount = orderCount;
            }

            return (
              <View style={styles.iconWithBadge}>
                <Ionicons name={iconName} size={size} color={color} />
                {badgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                  </View>
                )}
              </View>
            );
          },
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
            paddingBottom: 20,
            paddingTop: 16,
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

const styles = StyleSheet.create({
  iconWithBadge: {
    width: 28,
    height: 28,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#e63946',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
