import { TextStyle } from 'react-native';

export const fontFamily = {
  body: 'Pretendard-Medium',
  bodyStrong: 'Pretendard-SemiBold',
  bodyBold: 'Pretendard-Bold',
  bodyExtraBold: 'Pretendard-ExtraBold',
  display: 'JoyfulStory',
  sticker: 'AbiMimi',
} as const;

export const typography = {
  logo: {
    fontFamily: fontFamily.display,
    fontSize: 38,
    lineHeight: 44,
  } satisfies TextStyle,
  displayLg: {
    fontFamily: fontFamily.display,
    fontSize: 40,
    lineHeight: 46,
  } satisfies TextStyle,
  displayMd: {
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 38,
  } satisfies TextStyle,
  titleLg: {
    fontFamily: fontFamily.bodyExtraBold,
    fontSize: 28,
    lineHeight: 34,
  } satisfies TextStyle,
  titleMd: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 22,
    lineHeight: 28,
  } satisfies TextStyle,
  bodyLg: {
    fontFamily: fontFamily.body,
    fontSize: 18,
    lineHeight: 26,
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  bodySm: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 21,
  } satisfies TextStyle,
  label: {
    fontFamily: fontFamily.bodyStrong,
    fontSize: 14,
    lineHeight: 18,
  } satisfies TextStyle,
  sticker: {
    fontFamily: fontFamily.sticker,
    fontSize: 17,
    lineHeight: 22,
  } satisfies TextStyle,
  numberXl: {
    fontFamily: fontFamily.bodyExtraBold,
    fontSize: 48,
    lineHeight: 54,
  } satisfies TextStyle,
  numberLg: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 32,
    lineHeight: 38,
  } satisfies TextStyle,
  numberMd: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 24,
    lineHeight: 30,
  } satisfies TextStyle,
};

export const navigationFonts = {
  regular: {
    fontFamily: fontFamily.body,
    fontWeight: '500' as const,
  },
  medium: {
    fontFamily: fontFamily.bodyStrong,
    fontWeight: '600' as const,
  },
  bold: {
    fontFamily: fontFamily.bodyBold,
    fontWeight: '700' as const,
  },
  heavy: {
    fontFamily: fontFamily.bodyExtraBold,
    fontWeight: '800' as const,
  },
};
