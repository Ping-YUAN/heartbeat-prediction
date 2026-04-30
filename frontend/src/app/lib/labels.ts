export function patientLabel(label: number | null) {
  if (label === 0) return 'Normal sample';
  if (label === 1) return 'Abnormal sample';
  return 'Unlabeled';
}
