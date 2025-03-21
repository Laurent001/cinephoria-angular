export interface Fields {
  name: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'toggle'
    | 'datetime'
    | 'select'
    | 'object'
    | 'masked'
    | 'image';
  options?: { label: string; value: number }[];
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  file?: string;
  value?: string;
}
