export interface Fields {
  name: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'toggle'
    | 'datetime'
    | 'select'
    | 'masked'
    | 'image';
  options?: { label: string; value: number }[];
  required?: boolean;
  readonly?: boolean;
  file?: string;
}
