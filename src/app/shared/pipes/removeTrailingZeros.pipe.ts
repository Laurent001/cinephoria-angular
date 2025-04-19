import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeTrailingZeros',
  standalone: true,
})
export class RemoveTrailingZerosPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '0';
    }
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue % 1 === 0 ? numValue.toFixed(0) : numValue.toFixed(2);
  }
}
