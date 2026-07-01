import {Pipe, PipeTransform} from '@angular/core';
import {HasDate} from '../../core/models/has-date.model';

@Pipe({
  name: 'sortByDate',
})
export class SortByDatePipe implements PipeTransform {
  transform<T extends HasDate>(values: T[]): T[] {
    if (!values || values.length === 0) {
      return [];
    }
    return [...values].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      const validDateA = Number.isNaN(dateA) ? 0 : dateA;
      const validDateB = Number.isNaN(dateB) ? 0 : dateB;

      return validDateB - validDateA;
    });
  }
}
