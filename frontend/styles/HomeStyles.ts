// styles/HomeStyles.ts
import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
  },
  backgroundImage: {
    // flex: 1,
    // resizeMode: 'cover',
    zIndex: -1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  helloText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
    safe: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
});
