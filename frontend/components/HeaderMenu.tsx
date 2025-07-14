// components/Header.tsx
import { View } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function HeaderMenu() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <IconButton
            icon="dots-vertical"
            onPress={() => setVisible(true)}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            setVisible(false);
            router.push('/new-chat');
          }}
          title="Start New Chat"
          leadingIcon="plus"
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            router.push('/past-chats');
          }}
          title="View Past Chats"
          leadingIcon="history"
        />
      </Menu>
    </View>
  );
}
