import { GluestackUIProvider, Box, Text } from '@gluestack-ui/themed';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { config } from '@gluestack-ui/config';
import './global.css';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Box style={styles.container}>
        <Text size="xl" mb="$4">Gluestack UI + NativeWind! 🎉</Text>

        {/* Gluestack UI Button */}
        <TouchableOpacity style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginBottom: 16 }}
          onPress={() => console.log("Gluestack button pressed")}>
          <Text color="white">Gluestack UI Button</Text>
        </TouchableOpacity>

        {/* NativeWind Button */}
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-lg mb-4 shadow-lg"
          onPress={() => console.log("NativeWind button pressed")}>
          <Text className="text-white font-bold text-center">NativeWind Button</Text>
        </TouchableOpacity>

        {/* Mixed styling example */}
        <View className="bg-purple-100 p-4 rounded-xl border-2 border-purple-300">
          <Text className="text-purple-800 font-semibold text-lg text-center">
            NativeWind + Gluestack UI working together! ✨
          </Text>
        </View>

        <StatusBar style="auto" />
      </Box>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
