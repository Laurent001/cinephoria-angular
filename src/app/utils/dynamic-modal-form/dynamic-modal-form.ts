export interface Fields {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'toggle' | 'date' | 'select';
  options?: { label: string; value: number }[];
  required?: boolean;
}
