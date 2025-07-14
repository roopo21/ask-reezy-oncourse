
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import ChatHeader from "../components/ChatHeader";
import SearchTabs from "../components/SearchTabs";
import PopularSearches from "../components/PopularSearches";
import BottomInput from "../components/BottomInput";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";

import { router } from "expo-router";


const HomeScreen = () => {
      const { width, height } = Dimensions.get('window');
  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={require('../assets/background.png')}
        style={[styles.backgroundImage, { opacity: 0.5, width, height}]}
      />
      <View style={styles.container}>
        <CustomHeader />
        <ChatHeader />
        <SearchTabs />
        <ScrollView style={styles.scrollView}>
          <PopularSearches />
        </ScrollView>
        <BottomInput onSubmit={(query) => {
            router.push({ pathname: '/quiz', params: { query, mode: 'question' } });
        }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;
