import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.WHITE,
    fontSize: 15,
    marginRight: 20
  }
});