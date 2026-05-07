import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { palette, radius, shadow } from '@/constants/fire-theme';

export function ScreenShell({ children }: PropsWithChildren) {
  return <View style={styles.screen}>{children}</View>;
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
      </View>
      {right ?? <FireMascot size={58} mood="spark" />}
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
        <DoodleUnderline width={170} />
      </View>
      <View style={styles.countdownMascotRow}>
        <FireMascot size={136} mood="happy" withLog />
        {speech ? (
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{speech}</Text>
          </View>
        ) : null}
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
    </View>
  );
}

export function FireProgressBar({
  value,
  color = palette.primary,
  trackColor = '#F3E9D8',
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

export function DoodleUnderline({ width = 140, color = palette.primary }: { width?: number; color?: string }) {
  return (
    <View style={[styles.underlineWrap, { width }]}>
      <View style={[styles.underline, { backgroundColor: color, width: width * 0.9, transform: [{ rotate: '-2deg' }] }]} />
      <View style={[styles.underline, { backgroundColor: color, width: width * 0.72, marginLeft: 18, marginTop: 2, transform: [{ rotate: '2deg' }] }]} />
    </View>
  );
}

export function FireMascot({
  size = 88,
  mood = 'happy',
  withLog = false,
}: {
  size?: number;
  mood?: 'happy' | 'spark' | 'cheer';
  withLog?: boolean;
}) {
  return (
    <View style={[styles.mascotWrap, { width: size * 1.3 }]}>
      <View
        style={[
          styles.flameOuter,
          {
            width: size,
            height: size * 1.08,
            borderRadius: size * 0.34,
          },
        ]}>
        <View
          style={[
            styles.flameInner,
            {
              width: size * 0.3,
              height: size * 0.34,
              top: size * 0.12,
              borderRadius: size * 0.14,
            },
          ]}
        />
        <View style={[styles.eyeDot, { left: size * 0.28, top: size * 0.46, width: size * 0.08, height: size * 0.12, borderRadius: size * 0.04 }]} />
        <View style={[styles.eyeDot, { right: size * 0.28, top: size * 0.46, width: size * 0.08, height: size * 0.12, borderRadius: size * 0.04 }]} />
        <View
          style={[
            styles.mouth,
            mood === 'spark' ? styles.sparkMouth : null,
            { width: size * 0.24, height: size * 0.12, bottom: size * 0.18, borderRadius: size * 0.1 },
          ]}
        />
      </View>
      {mood === 'cheer' ? (
        <>
          <View style={[styles.sparkle, { left: 2, top: 12 }]} />
          <View style={[styles.sparkle, { right: 10, top: 4 }]} />
        </>
      ) : null}
      {withLog ? (
        <View style={[styles.logRow, { marginTop: size * -0.04 }]}>
          <View style={styles.logStick} />
          <View style={[styles.logStick, { marginLeft: -12, transform: [{ rotate: '10deg' }] }]} />
        </View>
      ) : null}
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
}: {
  label: string;
  dark?: boolean;
  primary?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable style={[styles.button, dark ? styles.buttonDark : null, primary ? styles.buttonPrimary : null, style]}>
      <Text style={[styles.buttonText, dark ? styles.buttonDarkText : null]}>{label}</Text>
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
  eyebrow: {
    color: palette.textSecondary,
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: palette.textPrimary,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
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
    borderWidth: 1.5,
    padding: 18,
    ...shadow.card,
  },
  cardStroke: {
    position: 'absolute',
    height: 2,
    backgroundColor: palette.textPrimary,
    opacity: 0.15,
    borderRadius: 999,
  },
  strokeTop: {
    width: 34,
    right: 18,
    top: -4,
    transform: [{ rotate: '-8deg' }],
  },
  strokeBottom: {
    width: 42,
    left: 22,
    bottom: -4,
    transform: [{ rotate: '4deg' }],
  },
  countdown: {
    alignItems: 'center',
  },
  countdownEyebrow: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  countdownMetricWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  countdownMetric: {
    color: palette.textPrimary,
    fontSize: 54,
    fontWeight: '900',
    lineHeight: 64,
  },
  countdownMascotRow: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 174,
  },
  speechBubble: {
    position: 'absolute',
    right: 10,
    top: 16,
    backgroundColor: '#FFFDF9',
    borderColor: palette.textPrimary,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: 120,
    ...shadow.soft,
  },
  speechText: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameOuter: {
    backgroundColor: palette.orange,
    borderWidth: 2,
    borderColor: palette.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-2deg' }],
  },
  flameInner: {
    position: 'absolute',
    backgroundColor: palette.primary,
    borderColor: palette.textPrimary,
    borderWidth: 1.5,
    transform: [{ rotate: '12deg' }],
  },
  eyeDot: {
    position: 'absolute',
    backgroundColor: palette.textPrimary,
  },
  mouth: {
    position: 'absolute',
    borderBottomWidth: 3,
    borderColor: palette.textPrimary,
  },
  sparkMouth: {
    width: 10,
    borderRadius: 99,
    borderBottomWidth: 0,
    backgroundColor: palette.textPrimary,
  },
  sparkle: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: palette.highlight,
    borderWidth: 1,
    borderColor: palette.textPrimary,
    transform: [{ rotate: '45deg' }],
  },
  logRow: {
    flexDirection: 'row',
  },
  logStick: {
    width: 40,
    height: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#654028',
    backgroundColor: '#8A5733',
    transform: [{ rotate: '-12deg' }],
  },
  highlightNote: {
    position: 'relative',
    backgroundColor: '#FFF39D',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5D45A',
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
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  tape: {
    position: 'absolute',
    right: 18,
    top: -8,
    width: 28,
    height: 14,
    backgroundColor: '#F0D7A6AA',
    borderRadius: 4,
    transform: [{ rotate: '34deg' }],
  },
  progressTrack: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  underlineWrap: {
    marginTop: 4,
  },
  underline: {
    height: 4,
    borderRadius: 99,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4EBDC',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillActive: {
    backgroundColor: palette.textPrimary,
  },
  pillDark: {
    backgroundColor: '#1F1E1B',
  },
  pillText: {
    color: palette.textSecondary,
    fontSize: 13,
    fontWeight: '800',
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
    backgroundColor: '#F0E6D7',
    borderRadius: radius.control,
    minHeight: 50,
    paddingHorizontal: 18,
  },
  buttonPrimary: {
    backgroundColor: palette.primary,
  },
  buttonDark: {
    backgroundColor: palette.textPrimary,
  },
  buttonText: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  buttonDarkText: {
    color: '#FFFFFF',
  },
  smallStat: {
    flex: 1,
    backgroundColor: '#FFF9EE',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 4,
    ...shadow.soft,
  },
  smallStatLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  smallStatValue: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '900',
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
    backgroundColor: '#E9E0D1',
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FF9586',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: palette.chartBlue,
  },
  rankingWrap: {
    gap: 10,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  rankRowMine: {
    backgroundColor: '#FFE2DB',
  },
  rankMedal: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFE4D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankMedalTop: {
    backgroundColor: '#FFE89A',
  },
  rankGold: {
    backgroundColor: '#FFD14F',
  },
  rankMedalText: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  rankAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankAvatarText: {
    fontSize: 18,
  },
  rankName: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  rankValue: {
    color: palette.textSecondary,
    fontSize: 17,
    fontWeight: '900',
  },
  rankValueMine: {
    color: palette.primary,
  },
});
