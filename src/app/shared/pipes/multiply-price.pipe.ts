import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'multiplyPrice'
})
@Injectable({
  providedIn: 'root'
})
export class MultiplyPricePipe implements PipeTransform {

  transform(price: number, cartedCount: number): number {
    return price * cartedCount;
  }

}
