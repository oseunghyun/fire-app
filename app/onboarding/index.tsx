import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { MemberForm } from '@/components/MemberForm';
import { FireMascot, HandDrawnCard, Header, PillBadge, PillButton, ScreenShell } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { fontFamily, typography } from '@/constants/typography';
import { Child, HouseholdType } from '@/lib/fireCalculator';
import { useHouseholdStore } from '@/store/householdStore';

const householdOptions: { label: string; value: HouseholdType }[] = [
  { label: '1인', value: 'single' },
  { label: '부부 맞벌이', value: 'coupleDualIncome' },
  { label: '부부 외벌이', value: 'coupleSingleIncome' },
  { label: '부부+자녀', value: 'coupleWithChildren' },
];

export default function OnboardingScreen() {
  const household = useHouseholdStore((state) => state.household);
  const setHouseholdType = useHouseholdStore((state) => state.setHouseholdType);
  const updateMember = useHouseholdStore((state) => state.updateMember);
  const updateChild = useHouseholdStore((state) => state.updateChild);
  const addChild = useHouseholdStore((state) => state.addChild);
  const removeChild = useHouseholdStore((state) => state.removeChild);
  const setSharedMonthlyExpense = useHouseholdStore((state) => state.setSharedMonthlyExpense);
  const updateSettings = useHouseholdStore((state) => state.updateSettings);
  const completeOnboarding = useHouseholdStore((state) => state.completeOnboarding);

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header eyebrow="FIRE 시작 세팅" title="우리 가족 정보를 먼저 적어볼까요?" right={<FireMascot size={62} mood="saving" />} />

        <HandDrawnCard accent={palette.softOrange} style={styles.introCard}>
          <Text style={styles.introTitle}>90초만 입력하면</Text>
          <Text style={styles.introBody}>FIRE까지 몇 년 남았는지, 매달 얼마나 당겨졌는지 바로 보여드릴게요.</Text>
        </HandDrawnCard>

        <HandDrawnCard style={styles.optionCard}>
          <Text style={styles.sectionTitle}>가구 유형</Text>
          <View style={styles.optionRow}>
            {householdOptions.map((option) => (
              <Pressable key={option.value} onPress={() => setHouseholdType(option.value)}>
                <PillBadge label={option.label} active={household.type === option.value} />
              </Pressable>
            ))}
          </View>
        </HandDrawnCard>

        {household.members.map((member) => (
          <MemberForm
            key={member.id}
            label={member.id === 'self' ? '본인 정보' : '배우자 정보'}
            member={member}
            accent={member.id === 'self' ? palette.softCream : palette.softOrange}
            onChange={(field, value) => updateMember(member.id, { [field]: value } as never)}
          />
        ))}

        {household.type === 'coupleWithChildren' ? (
          <HandDrawnCard accent={palette.softBlue} style={styles.childWrap}>
            <View style={styles.childHeader}>
              <Text style={styles.sectionTitle}>자녀 정보</Text>
              <PillButton label="자녀 추가" style={styles.inlineButton} onPress={addChild} />
            </View>
            {household.children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onChange={(field, value) => updateChild(child.id, { [field]: value } as never)}
                onRemove={() => removeChild(child.id)}
              />
            ))}
          </HandDrawnCard>
        ) : null}

        <HandDrawnCard style={styles.optionCard}>
          <Text style={styles.sectionTitle}>공동 지출과 설정</Text>
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>가구 공동 지출</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(value) => setSharedMonthlyExpense(toNumber(value))}
              placeholder="0"
              placeholderTextColor="#998E7F"
              style={styles.input}
              value={`${household.sharedMonthlyExpense}`}
            />
          </View>
          <View style={styles.grid}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>인출률</Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={(value) => updateSettings({ withdrawalRate: toDecimal(value, 0.04) })}
                placeholder="0.04"
                placeholderTextColor="#998E7F"
                style={styles.input}
                value={`${household.settings.withdrawalRate}`}
              />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>기대 수익률</Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={(value) => updateSettings({ expectedAnnualReturn: toDecimal(value, 0.045) })}
                placeholder="0.045"
                placeholderTextColor="#998E7F"
                style={styles.input}
                value={`${household.settings.expectedAnnualReturn}`}
              />
            </View>
          </View>
        </HandDrawnCard>

        <PillButton
          label="FIRE 여정 시작하기"
          primary
          style={styles.startButton}
          dark={false}
          onPress={() => {
            completeOnboarding();
            router.replace('/');
          }}
        />
      </ScrollView>
    </ScreenShell>
  );
}

function ChildCard({
  child,
  onChange,
  onRemove,
}: {
  child: Child;
  onChange: (field: keyof Child, value: string | number) => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.childCard}>
      <View style={styles.childTop}>
        <Text style={styles.childTitle}>{child.name}</Text>
        <Pressable onPress={onRemove}>
          <Text style={styles.removeText}>삭제</Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>현재 나이</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(value) => onChange('age', toNumber(value))}
            style={styles.input}
            value={`${child.age}`}
          />
        </View>
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>독립 예상 나이</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(value) => onChange('independenceAge', toNumber(value))}
            style={styles.input}
            value={`${child.independenceAge}`}
          />
        </View>
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>월 양육·교육비</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(value) => onChange('monthlyCost', toNumber(value))}
            style={styles.input}
            value={`${child.monthlyCost}`}
          />
        </View>
      </View>
    </View>
  );
}

function toNumber(value: string) {
  const digits = value.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

function toDecimal(value: string, fallback: number) {
  const normalized = value.replace(/[^0-9.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  introCard: {
    gap: 8,
  },
  introTitle: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  introBody: {
    color: palette.textSecondary,
    ...typography.body,
  },
  optionCard: {
    gap: 12,
  },
  sectionTitle: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  childWrap: {
    gap: 12,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlineButton: {
    minHeight: 38,
    paddingHorizontal: 14,
  },
  childCard: {
    backgroundColor: palette.paper,
    borderWidth: 2,
    borderColor: palette.cardLine,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  childTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childTitle: {
    color: palette.textPrimary,
    ...typography.titleMd,
  },
  removeText: {
    color: palette.primary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 14,
  },
  fieldBlock: {
    minWidth: '47%',
    flexGrow: 1,
  },
  fieldLabel: {
    color: palette.textSecondary,
    marginBottom: 6,
    ...typography.label,
  },
  input: {
    backgroundColor: palette.paper,
    borderWidth: 2,
    borderColor: palette.cardLine,
    borderRadius: 18,
    color: palette.textPrimary,
    fontFamily: fontFamily.bodyStrong,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  startButton: {
    marginHorizontal: 20,
    marginTop: 18,
  },
});
