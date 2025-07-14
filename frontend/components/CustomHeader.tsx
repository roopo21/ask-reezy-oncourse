// components/CustomHeader.tsx
import { View, Text } from 'react-native';
import HeaderMenu from './HeaderMenu';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomHeader() {
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginTop: -50,
        }}
      >
          <HeaderMenu />


        {/* Center: Title */}
        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#111827' }}>
          Ask Rezzy
        </Text>

        {/* Right: Spacer to balance HeaderMenu width */}
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );
}
