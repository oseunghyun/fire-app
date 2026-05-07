import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { palette, radius } from '@/constants/fire-theme';

export function ScreenShell({ children }: PropsWithChildren) {
  return <View style={styles.screen}>{children}</View>;
}

export function SectionCard({
  children,
  accent,
  style,
}: PropsWithChildren<{ accent?: string; style?: ViewStyle }>) {
  return <View style={[styles.card, accent ? { backgroundColor: accent } : null, style]}>{children}</View>;
}

export function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <FlameMark size={54} />
    </View>
  );
}

export function ProgressBar({ value, color = palette.green }: { value: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} />
    </View>
  );
}

export function FlameMark({ size = 72, label }: { size?: number; label?: string }) {
  return (
    <View
      style={[
        styles.flame,
        {
          width: size,
          height: size * 1.14,
          borderRadius: size * 0.48,
        },
      ]}>
      <Text style={[styles.flameText, { fontSize: size * 0.38 }]}>{label ?? 'F'}</Text>
    </View>
  );
}

export function MascotCluster() {
  return (
    <View style={styles.cluster}>
      <Bubble color={palette.mint} size={112} style={{ left: 6, top: 24, transform: [{ rotate: '-8deg' }] }} face="smile" />
      <Bubble color={palette.sky} size={138} style={{ left: 14, bottom: 4, transform: [{ rotate: '7deg' }] }} face="calm" />
      <Bubble color="#FFB2A8" size={118} style={{ right: 12, top: 36, transform: [{ rotate: '9deg' }] }} face="open" />
      <Bubble color="#FFE394" size={132} style={{ right: 0, bottom: 8, transform: [{ rotate: '-5deg' }] }} face="wink" />
      <View style={styles.speech}>
        <Text style={styles.speechText}>FIRE~</Text>
      </View>
      <View style={styles.loopLine} />
    </View>
  );
}

export function MountainScene() {
  return (
    <View style={styles.mountainScene}>
      <View style={styles.mountainBack} />
      <View style={styles.mountainFront} />
      <View style={styles.flagPole} />
      <View style={styles.flag} />
      <View style={[styles.walker, { left: 76, bottom: 34 }]} />
      <View style={[styles.walker, { left: 150, bottom: 54 }]} />
      <View style={[styles.walker, { left: 222, bottom: 34 }]} />
    </View>
  );
}

export function AssetChart() {
  return (
    <View style={styles.chart}>
      <View style={[styles.gridLine, { top: 24 }]} />
      <View style={[styles.gridLine, { top: 70 }]} />
      <View style={[styles.gridLine, { top: 116 }]} />
      <View style={styles.targetLine} />
      <View style={[styles.chartSegment, { left: 12, bottom: 24, width: 76, transform: [{ rotate: '-14deg' }] }]} />
      <View style={[styles.chartSegment, { left: 76, bottom: 50, width: 70, transform: [{ rotate: '8deg' }] }]} />
      <View style={[styles.chartSegment, { left: 136, bottom: 58, width: 82, transform: [{ rotate: '-22deg' }] }]} />
      <View style={[styles.chartSegment, { left: 202, bottom: 88, width: 86, transform: [{ rotate: '4deg' }] }]} />
      <View style={styles.chartDot} />
    </View>
  );
}

export function PillButton({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <View style={[styles.button, dark ? styles.buttonDark : null]}>
      <Text style={[styles.buttonText, dark ? styles.buttonDarkText : null]}>{label}</Text>
    </View>
  );
}

export function SmallStat({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.smallStat}>
      <MaterialIcons name={icon} size={19} color={palette.ink} />
      <Text style={styles.smallStatLabel}>{label}</Text>
      <Text style={styles.smallStatValue}>{value}</Text>
    </View>
  );
}

function Bubble({
  color,
  size,
  style,
  face,
}: {
  color: string;
  size: number;
  style: ViewStyle;
  face: 'smile' | 'calm' | 'open' | 'wink';
}) {
  return (
    <View style={[styles.bubble, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}>
      <View style={styles.eyeRow}>
        <View style={styles.eye} />
        <View style={[styles.eye, face === 'wink' ? styles.winkEye : null]} />
      </View>
      <View style={[styles.mouth, face === 'open' ? styles.openMouth : null, face === 'calm' ? styles.calmMouth : null]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 62,
    paddingBottom: 8,
  },
  eyebrow: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '900',
  },
  title: {
    color: palette.ink,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 42,
    marginTop: 6,
  },
  card: {
    backgroundColor: palette.paper,
    borderColor: palette.ink,
    borderRadius: radius.card,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
  },
  progressTrack: {
    height: 18,
    borderWidth: 2,
    borderColor: palette.ink,
    borderRadius: radius.pill,
    backgroundColor: '#EEEAE2',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  flame: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.coral,
    borderColor: palette.ink,
    borderWidth: 3,
    transform: [{ rotate: '8deg' }],
  },
  flameText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  cluster: {
    height: 292,
    marginTop: 20,
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    borderColor: palette.ink,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 13,
  },
  eye: {
    width: 14,
    height: 22,
    borderRadius: 8,
    backgroundColor: palette.ink,
  },
  winkEye: {
    height: 7,
    marginTop: 8,
  },
  mouth: {
    width: 44,
    height: 22,
    borderBottomWidth: 7,
    borderColor: palette.ink,
    borderRadius: 28,
  },
  openMouth: {
    width: 28,
    height: 24,
    borderBottomWidth: 0,
    backgroundColor: palette.ink,
    borderRadius: 16,
  },
  calmMouth: {
    width: 42,
    height: 12,
  },
  speech: {
    position: 'absolute',
    left: 128,
    top: 120,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: palette.ink,
    transform: [{ rotate: '-7deg' }],
  },
  speechText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  loopLine: {
    position: 'absolute',
    left: 72,
    top: 94,
    width: 190,
    height: 88,
    borderTopWidth: 3,
    borderColor: palette.ink,
    borderRadius: 90,
    transform: [{ rotate: '-12deg' }],
  },
  mountainScene: {
    height: 176,
    overflow: 'hidden',
    position: 'relative',
  },
  mountainBack: {
    position: 'absolute',
    left: 28,
    bottom: -56,
    width: 180,
    height: 180,
    borderWidth: 3,
    borderColor: palette.ink,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  mountainFront: {
    position: 'absolute',
    right: 22,
    bottom: -46,
    width: 130,
    height: 130,
    borderWidth: 3,
    borderColor: palette.ink,
    backgroundColor: '#EFF8E8',
    transform: [{ rotate: '45deg' }],
  },
  flagPole: {
    position: 'absolute',
    right: 70,
    top: 20,
    width: 4,
    height: 74,
    backgroundColor: palette.ink,
  },
  flag: {
    position: 'absolute',
    right: 28,
    top: 18,
    width: 48,
    height: 30,
    backgroundColor: palette.coral,
    borderColor: palette.ink,
    borderWidth: 3,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  walker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: palette.ink,
    backgroundColor: palette.yellow,
  },
  chart: {
    height: 150,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E8E3DA',
  },
  targetLine: {
    position: 'absolute',
    left: 4,
    right: 6,
    top: 40,
    height: 0,
    borderTopWidth: 4,
    borderStyle: 'dashed',
    borderColor: palette.coral,
    transform: [{ rotate: '-4deg' }],
  },
  chartSegment: {
    position: 'absolute',
    height: 7,
    borderRadius: 7,
    backgroundColor: palette.blue,
  },
  chartDot: {
    position: 'absolute',
    right: 9,
    top: 49,
    width: 16,
    height: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    backgroundColor: palette.blue,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.ink,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  buttonDark: {
    backgroundColor: palette.ink,
  },
  buttonText: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  buttonDarkText: {
    color: '#FFFFFF',
  },
  smallStat: {
    flex: 1,
    minHeight: 92,
    borderWidth: 2,
    borderColor: palette.line,
    borderRadius: radius.control,
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  smallStatLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  smallStatValue: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
});
