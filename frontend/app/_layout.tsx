import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from 'react-native-paper';
import { View } from "react-native";
import "../global.css"; // if you're using CSS-based setup
import HeaderMenu from "../components/HeaderMenu";
import CustomHeader from "../components/CustomHeader";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <PaperProvider>
    <QueryClientProvider client={queryClient}>
      <Stack       screenOptions={{
        headerShown: false, // This disables the header for all screens
      }}>
      </Stack>
    </QueryClientProvider>
    </PaperProvider>

  );
}
