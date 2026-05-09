import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { palette, radius, shadow } from '@/constants/fire-theme';
import { fontFamily, typography } from '@/constants/typography';

const fireIdleAsset = require('@/assets/mascot/fire_idle.png') as ImageSourcePropType;
const fireAnalyzingAsset = require('@/assets/mascot/fire_analyzing.png') as ImageSourcePropType;
const fireGoalAsset = require('@/assets/mascot/fire_goal.png') as ImageSourcePropType;
const fireRocketAsset = require('@/assets/mascot/fire_rocket.png') as ImageSourcePropType;
const fireSavingAsset = require('@/assets/mascot/fire_saving.png') as ImageSourcePropType;
const fireSurprisedAsset = require('@/assets/mascot/fire_surprised.png') as ImageSourcePropType;
const fireThinkAsset = require('@/assets/mascot/fire_think.png') as ImageSourcePropType;
const fireTiredAsset = require('@/assets/mascot/fire_tired.png') as ImageSourcePropType;
const fireWinnerAsset = require('@/assets/mascot/fire_winner.png') as ImageSourcePropType;
const iconsPackAsset = require('@/assets/icon/icons-pack.png') as ImageSourcePropType;
const penDrawingAsset = require('@/assets/icon/pen_drawing.png') as ImageSourcePropType;

const ICONS_PACK_WIDTH = 1536;
const ICONS_PACK_HEIGHT = 1024;

const spriteMap = {
  fire: { x: 250, y: 165, width: 250, height: 300 },
  saving: { x: 695, y: 185, width: 330, height: 255 },
  crew: { x: 1060, y: 165, width: 360, height: 300 },
  report: { x: 255, y: 610, width: 260, height: 325 },
  goal: { x: 705, y: 640, width: 340, height: 260 },
  rocket: { x: 1080, y: 615, width: 345, height: 315 },
} as const;

export type SpriteIconName = keyof typeof spriteMap;

export function ScreenShell({ children }: PropsWithChildren) {
  return (
    <View style={styles.screen}>
      <View style={styles.bgSparkTop} />
      <View style={styles.bgSparkBottom} />
      {children}
    </View>
  );
}

export function Header({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerUnderline}>
          <DoodleUnderline width={92} />
        </View>
      </View>
      {right ?? <FireMascot size={58} mood="spark" />}
      <View style={styles.headerSpark} />
    </View>
  );
}

export function HandDrawnCard({
  children,
  style,
  accent,
  tilt = 0,
}: PropsWithChildren<{ style?: ViewStyle; accent?: string; tilt?: number }>) {
  return (
    <View style={[styles.cardWrap, { transform: [{ rotate: `${tilt}deg` }] }]}>
      <View style={[styles.card, accent ? { backgroundColor: accent } : null, style]}>{children}</View>
      <View style={[styles.cardStroke, styles.strokeTop]} />
      <View style={[styles.cardStroke, styles.strokeBottom]} />
      <View style={[styles.cardStroke, styles.strokeSideLeft]} />
      <View style={[styles.cardStroke, styles.strokeSideRight]} />
      <View style={[styles.cardDot, styles.cardDotLeft]} />
      <View style={[styles.cardDot, styles.cardDotRight]} />
    </View>
  );
}

export function SectionCard(props: PropsWithChildren<{ style?: ViewStyle; accent?: string; tilt?: number }>) {
  return <HandDrawnCard {...props} />;
}

export function FireCountdown({
  monthsText,
  subLabel,
  speech,
}: {
  monthsText: string;
  subLabel: string;
  speech?: string;
}) {
  return (
    <View style={styles.countdown}>
      <Text style={styles.countdownEyebrow}>{subLabel}</Text>
      <View style={styles.countdownMetricWrap}>
        <Text style={styles.countdownMetric}>{monthsText}</Text>
        <DoodleUnderline width={176} />
      </View>
      <View style={styles.countdownMascotRow}>
        <FireMascot size={148} mood="happy" />
        {speech ? (
          <View style={styles.speechWrap}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>{speech}</Text>
            </View>
            <View style={styles.speechTail} />
            <View style={styles.speechTailMini} />
          </View>
        ) : null}
        <View style={styles.countdownSpeedLine} />
        <View style={styles.countdownSparkle} />
      </View>
    </View>
  );
}

export function HighlightNote({
  text,
  emoji = '✍️',
  style,
}: {
  text: string;
  emoji?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.highlightNote, style]}>
      <Text style={styles.highlightEmoji}>{emoji}</Text>
      <Text style={styles.highlightText}>{text}</Text>
      <View style={styles.tape} />
      <View style={styles.noteDottedLine} />
    </View>
  );
}

export function FireProgressBar({
  value,
  color = palette.primary,
  trackColor = palette.softNeutral,
  height = 16,
}: {
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor, height }]}>
      <View style={[styles.progressFill, { width: `${safeValue}%`, backgroundColor: color }]} />
    </View>
  );
}

export function ProgressBar(props: { value: number; color?: string }) {
  return <FireProgressBar value={props.value} color={props.color} />;
}

export function DoodleUnderline({ width = 140 }: { width?: number; color?: string }) {
  const imageWidth = width * 1.58;
  const imageHeight = imageWidth * (1024 / 1536);
  const visibleHeight = Math.max(18, width * 0.16);

  return (
    <View style={[styles.underlineWrap, { width, height: visibleHeight }]}>
      <Image
        source={penDrawingAsset}
        style={[
          styles.underlineImage,
          {
            width: imageWidth,
            height: imageHeight,
            left: (width - imageWidth) / 2,
            top: visibleHeight / 2 - imageHeight * 0.47,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

export function FireMascot({
  size = 88,
  mood = 'happy',
}: {
  size?: number;
  mood?: 'idle' | 'happy' | 'spark' | 'cheer' | 'saving' | 'goal' | 'rocket' | 'analyzing' | 'surprised' | 'tired' | 'winner';
}) {
  const source = {
    idle: fireIdleAsset,
    happy: fireIdleAsset,
    spark: fireThinkAsset,
    cheer: fireIdleAsset,
    saving: fireSavingAsset,
    goal: fireGoalAsset,
    rocket: fireRocketAsset,
    analyzing: fireAnalyzingAsset,
    surprised: fireSurprisedAsset,
    tired: fireTiredAsset,
    winner: fireWinnerAsset,
  }[mood];
  const visualWidth = size * 1.34;
  const visualHeight = size * 1.44;
  const wiggle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggle, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wiggle, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [wiggle]);

  const rotate = wiggle.interpolate({
    inputRange: [0, 1],
    outputRange: ['-1.5deg', '1.5deg'],
  });
  const scale = wiggle.interpolate({
    inputRange: [0, 1],
    outputRange: [0.985, 1.02],
  });
  const lift = wiggle.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return (
    <Animated.View
      style={[
        styles.mascotWrap,
        {
          width: visualWidth,
          height: visualHeight,
          transform: [{ rotate }, { scale }, { translateY: lift }],
        },
      ]}>
      <Image source={source} style={{ width: visualWidth, height: visualHeight }} resizeMode="contain" />
      <View style={styles.mascotShadow} />
      {mood === 'cheer' ? (
        <>
          <View style={[styles.sparkle, { left: 2, top: 12 }]} />
          <View style={[styles.sparkle, { right: 10, top: 4 }]} />
          <View style={styles.heart} />
        </>
      ) : null}
    </Animated.View>
  );
}

export function SpriteIcon({
  name,
  size = 28,
  style,
}: {
  name: SpriteIconName;
  size?: number;
  style?: ViewStyle;
}) {
  const crop = spriteMap[name];
  const scale = size / Math.max(crop.width, crop.height);
  const scaledWidth = ICONS_PACK_WIDTH * scale;
  const scaledHeight = ICONS_PACK_HEIGHT * scale;
  const frameWidth = crop.width * scale;
  const frameHeight = crop.height * scale;

  return (
    <View style={[styles.spriteFrame, { width: size, height: size }, style]}>
      <Image
        source={iconsPackAsset}
        resizeMode="contain"
        style={{
          position: 'absolute',
          width: scaledWidth,
          height: scaledHeight,
          left: -crop.x * scale + (size - frameWidth) / 2,
          top: -crop.y * scale + (size - frameHeight) / 2,
        }}
      />
    </View>
  );
}

export function PillBadge({ label, active = false, dark = false }: { label: string; active?: boolean; dark?: boolean }) {
  return (
    <View style={[styles.pill, active ? styles.pillActive : null, dark ? styles.pillDark : null]}>
      <Text style={[styles.pillText, active ? styles.pillTextActive : null, dark ? styles.pillTextDark : null]}>{label}</Text>
    </View>
  );
}

export function PillButton({
  label,
  dark,
  primary = false,
  style,
  onPress,
}: {
  label: string;
  dark?: boolean;
  primary?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.button, dark ? styles.buttonDark : null, primary ? styles.buttonPrimary : null, style]}>
      <Text style={[styles.buttonText, dark ? styles.buttonDarkText : null]}>{label}</Text>
      <View style={styles.buttonDoodle} />
    </Pressable>
  );
}

export function SmallStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <View style={[styles.smallStat, accent ? { backgroundColor: accent } : null]}>
      <MaterialIcons name={icon} size={18} color={palette.textPrimary} />
      <Text style={styles.smallStatLabel}>{label}</Text>
      <Text style={styles.smallStatValue}>{value}</Text>
    </View>
  );
}

export function AssetChart() {
  const points = [
    { left: 6, bottom: 26 },
    { left: 34, bottom: 42 },
    { left: 62, bottom: 38 },
    { left: 92, bottom: 58 },
    { left: 122, bottom: 56 },
    { left: 152, bottom: 82 },
    { left: 182, bottom: 78 },
    { left: 212, bottom: 102 },
    { left: 242, bottom: 118 },
  ];

  return (
    <View style={styles.chart}>
      <View style={[styles.gridLine, { top: 32 }]} />
      <View style={[styles.gridLine, { top: 76 }]} />
      <View style={[styles.gridLine, { top: 120 }]} />
      <View style={styles.targetLine} />
      <View style={[styles.chartSegment, { left: 10, bottom: 34, width: 34, transform: [{ rotate: '-28deg' }] }]} />
      <View style={[styles.chartSegment, { left: 38, bottom: 44, width: 32, transform: [{ rotate: '10deg' }] }]} />
      <View style={[styles.chartSegment, { left: 68, bottom: 45, width: 36, transform: [{ rotate: '-32deg' }] }]} />
      <View style={[styles.chartSegment, { left: 98, bottom: 58, width: 34, transform: [{ rotate: '2deg' }] }]} />
      <View style={[styles.chartSegment, { left: 128, bottom: 65, width: 38, transform: [{ rotate: '-38deg' }] }]} />
      <View style={[styles.chartSegment, { left: 160, bottom: 83, width: 36, transform: [{ rotate: '8deg' }] }]} />
      <View style={[styles.chartSegment, { left: 190, bottom: 88, width: 34, transform: [{ rotate: '-28deg' }] }]} />
      <View style={[styles.chartSegment, { left: 220, bottom: 108, width: 32, transform: [{ rotate: '-18deg' }] }]} />
      {points.map((point, index) => (
        <View key={index} style={[styles.chartDot, point]} />
      ))}
    </View>
  );
}

export function CrewRankingCard({
  rows,
  myRank,
}: {
  rows: { rank: number; name: string; value: string; badge?: string }[];
  myRank: number;
}) {
  return (
    <View style={styles.rankingWrap}>
      {rows.map((row) => {
        const isMine = row.rank === myRank;
        const isTopThree = row.rank <= 3;
        return (
          <View key={row.rank} style={[styles.rankRow, isMine ? styles.rankRowMine : null]}>
            <View style={[styles.rankMedal, isTopThree ? styles.rankMedalTop : null, row.rank === 1 ? styles.rankGold : null]}>
              <Text style={styles.rankMedalText}>{row.badge ?? `${row.rank}`}</Text>
            </View>
            <View style={styles.rankAvatar}>
              <Text style={styles.rankAvatarText}>{isTopThree ? '👑' : '🙂'}</Text>
            </View>
            <Text style={styles.rankName}>{row.name}</Text>
            <Text style={[styles.rankValue, isMine ? styles.rankValueMine : null]}>{row.value}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  bgSparkTop: {
    position: 'absolute',
    top: 92,
    right: 18,
    width: 8,
    height: 8,
    backgroundColor: palette.highlight,
    borderWidth: 2,
    borderColor: palette.textPrimary,
    transform: [{ rotate: '45deg' }],
    opacity: 0.55,
  },
  bgSparkBottom: {
    position: 'absolute',
    bottom: 118,
    left: 16,
    width: 26,
    height: 2,
    borderRadius: 99,
    backgroundColor: palette.textPrimary,
    opacity: 0.1,
    transform: [{ rotate: '12deg' }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 10,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  headerUnderline: {
    marginTop: 4,
  },
  headerSpark: {
    position: 'absolute',
    right: 18,
    top: 48,
    width: 10,
    height: 10,
    backgroundColor: palette.highlight,
    borderWidth: 2,
    borderColor: palette.textPrimary,
    transform: [{ rotate: '45deg' }],
  },
  eyebrow: {
    color: palette.textSecondary,
    ...typography.label,
  },
  title: {
    color: palette.textPrimary,
    ...typography.titleLg,
    marginTop: 5,
  },
  cardWrap: {
    marginHorizontal: 20,
    marginTop: 16,
    position: 'relative',
  },
  card: {
    backgroundColor: palette.paper,
    borderColor: palette.cardLine,
    borderRadius: radius.card,
    borderWidth: 2,
    padding: 18,
    ...shadow.card,
  },
  cardStroke: {
    position: 'absolute',
    height: 2,
    backgroundColor: palette.textPrimary,
    opacity: 0.14,
    borderRadius: 999,
  },
  strokeTop: {
    width: 40,
    right: 18,
    top: -4,
    transform: [{ rotate: '-8deg' }],
  },
  strokeBottom: {
    width: 48,
    left: 22,
    bottom: -4,
    transform: [{ rotate: '4deg' }],
  },
  strokeSideLeft: {
    width: 24,
    left: -9,
    top: 34,
    transform: [{ rotate: '-78deg' }],
  },
  strokeSideRight: {
    width: 22,
    right: -8,
    bottom: 34,
    transform: [{ rotate: '82deg' }],
  },
  cardDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: palette.textPrimary,
    opacity: 0.18,
  },
  cardDotLeft: {
    left: 14,
    top: 16,
  },
  cardDotRight: {
    right: 22,
    bottom: 18,
  },
  countdown: {
    alignItems: 'center',
  },
  countdownEyebrow: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  countdownMetricWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  countdownMetric: {
    color: palette.textPrimary,
    fontFamily: fontFamily.display,
    fontSize: 50,
    lineHeight: 58,
  },
  countdownMascotRow: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 190,
  },
  speechWrap: {
    position: 'absolute',
    right: 10,
    top: 10,
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: palette.paper,
    borderColor: palette.textPrimary,
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: 124,
    ...shadow.soft,
  },
  speechTail: {
    width: 18,
    height: 18,
    marginTop: -8,
    marginLeft: -30,
    backgroundColor: palette.paper,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: palette.textPrimary,
    transform: [{ rotate: '-30deg' }],
  },
  speechTailMini: {
    width: 8,
    height: 8,
    marginTop: -4,
    marginLeft: -18,
    backgroundColor: palette.paper,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: palette.textPrimary,
    transform: [{ rotate: '-18deg' }],
  },
  speechText: {
    color: palette.textPrimary,
    ...typography.sticker,
    textAlign: 'center',
  },
  countdownSpeedLine: {
    position: 'absolute',
    left: 22,
    bottom: 38,
    width: 34,
    height: 2,
    backgroundColor: palette.textPrimary,
    opacity: 0.16,
    transform: [{ rotate: '-14deg' }],
  },
  countdownSparkle: {
    position: 'absolute',
    right: 16,
    bottom: 28,
    width: 8,
    height: 8,
    borderWidth: 2,
    borderColor: palette.textPrimary,
    backgroundColor: palette.highlight,
    transform: [{ rotate: '45deg' }],
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotShadow: {
    position: 'absolute',
    bottom: 14,
    width: 50,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#00000012',
    zIndex: -1,
  },
  sparkle: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: palette.highlight,
    borderWidth: 1.5,
    borderColor: palette.textPrimary,
    transform: [{ rotate: '45deg' }],
  },
  heart: {
    position: 'absolute',
    top: 2,
    right: 20,
    width: 10,
    height: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: palette.primary,
    transform: [{ rotate: '45deg' }],
  },
  highlightNote: {
    position: 'relative',
    backgroundColor: palette.highlight,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#CA9734',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadow.soft,
  },
  highlightEmoji: {
    fontSize: 18,
  },
  highlightText: {
    flex: 1,
    color: palette.textPrimary,
    ...typography.body,
  },
  tape: {
    position: 'absolute',
    right: 18,
    top: -8,
    width: 28,
    height: 14,
    backgroundColor: '#F4DFC0CC',
    borderRadius: 4,
    transform: [{ rotate: '34deg' }],
  },
  noteDottedLine: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 7,
    height: 1,
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderColor: '#00000018',
  },
  progressTrack: {
    borderWidth: 2,
    borderColor: palette.cardLine,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  underlineWrap: {
    marginTop: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  underlineImage: {
    position: 'absolute',
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: palette.softNeutral,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: palette.cardLine,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  pillDark: {
    backgroundColor: palette.textPrimary,
    borderColor: palette.textPrimary,
  },
  pillText: {
    color: palette.textSecondary,
    ...typography.label,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  pillTextDark: {
    color: '#FFFFFF',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.softNeutral,
    borderRadius: radius.control,
    borderWidth: 2,
    borderColor: palette.cardLine,
    minHeight: 50,
    overflow: 'hidden',
    paddingHorizontal: 18,
  },
  buttonPrimary: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  buttonDark: {
    backgroundColor: palette.textPrimary,
    borderColor: palette.textPrimary,
  },
  buttonText: {
    color: palette.textPrimary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
  },
  buttonDarkText: {
    color: '#FFFFFF',
  },
  buttonDoodle: {
    position: 'absolute',
    right: 12,
    bottom: 8,
    width: 20,
    height: 3,
    borderRadius: 99,
    backgroundColor: '#00000010',
    transform: [{ rotate: '-10deg' }],
  },
  smallStat: {
    flex: 1,
    backgroundColor: palette.softCream,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: palette.cardLine,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 4,
    ...shadow.soft,
  },
  smallStatLabel: {
    color: palette.textSecondary,
    fontFamily: fontFamily.bodyStrong,
    fontSize: 12,
  },
  smallStatValue: {
    color: palette.textPrimary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 18,
  },
  spriteFrame: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  chart: {
    height: 170,
    marginTop: 8,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: palette.cardLine,
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: palette.primary,
  },
  chartSegment: {
    position: 'absolute',
    height: 4,
    borderRadius: 999,
    backgroundColor: palette.chartBlue,
  },
  chartDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.paper,
    borderWidth: 2,
    borderColor: palette.chartBlue,
  },
  rankingWrap: {
    gap: 10,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.softCream,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: palette.cardLine,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  rankRowMine: {
    backgroundColor: palette.softCoral,
    borderColor: palette.primary,
  },
  rankMedal: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.softNeutral,
    borderWidth: 1.5,
    borderColor: palette.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankMedalTop: {
    backgroundColor: '#FFE2A5',
  },
  rankGold: {
    backgroundColor: palette.orange,
  },
  rankMedalText: {
    color: palette.textPrimary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 15,
  },
  rankAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.paper,
    borderWidth: 1.5,
    borderColor: palette.cardLine,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankAvatarText: {
    fontSize: 18,
  },
  rankName: {
    flex: 1,
    color: palette.textPrimary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
  },
  rankValue: {
    color: palette.textSecondary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 17,
  },
  rankValueMine: {
    color: palette.primary,
  },
});
