import { StyleSheet, Text, TextInput, View } from 'react-native';

import { HandDrawnCard } from '@/components/fire-ui';
import { palette } from '@/constants/fire-theme';
import { fontFamily, typography } from '@/constants/typography';
import { Member } from '@/lib/fireCalculator';

type MemberField = keyof Pick<
  Member,
  'name' | 'age' | 'goalRetirementAge' | 'monthlyIncome' | 'monthlyExpense' | 'currentAssets' | 'passiveIncomeMonthly'
>;

type Props = {
  label: string;
  member: Member;
  accent?: string;
  onChange: (field: MemberField, value: string | number) => void;
};

const memberFields: {
  field: Exclude<MemberField, 'name'>;
  label: string;
}[] = [
  { field: 'age', label: '나이' },
  { field: 'goalRetirementAge', label: '목표 은퇴 나이' },
  { field: 'monthlyIncome', label: '세후 월소득' },
  { field: 'monthlyExpense', label: '월지출' },
  { field: 'currentAssets', label: '현재 자산' },
  { field: 'passiveIncomeMonthly', label: '월 패시브 소득' },
];

export function MemberForm({ label, member, accent, onChange }: Props) {
  return (
    <HandDrawnCard accent={accent} style={styles.card} tilt={-0.5}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onChangeText={(value) => onChange('name', value)}
        placeholder="이름"
        placeholderTextColor="#998E7F"
        style={styles.nameInput}
        value={member.name}
      />

      <View style={styles.grid}>
        {memberFields.map((field) => (
          <View key={field.field} style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(value) => onChange(field.field, toNumber(value))}
              placeholder="0"
              placeholderTextColor="#998E7F"
              style={styles.input}
              value={`${member[field.field]}`}
            />
          </View>
        ))}
      </View>
    </HandDrawnCard>
  );
}

function toNumber(value: string) {
  const digits = value.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  label: {
    color: palette.textPrimary,
    ...typography.displayMd,
  },
  nameInput: {
    backgroundColor: palette.paper,
    borderWidth: 2,
    borderColor: palette.cardLine,
    borderRadius: 18,
    color: palette.textPrimary,
    fontFamily: fontFamily.bodyStrong,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
});
