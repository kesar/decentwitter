import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform(value: string): string {

    if (value.length > 255) {
      value = value.substring(0, 255) + '...';
    }

    return value;
  }
}