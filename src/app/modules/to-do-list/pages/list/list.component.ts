import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { IListItens } from '../../interface/IListItem.interface';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  public addItem = signal(true);

  #setListItens = signal<IListItens[]>(this.#parseItens());
  public getListItens = this.#setListItens.asReadonly();

  #parseItens() {
    return JSON.parse(localStorage.getItem('@my-list') || '[]');
  }

  public getInputAndAddItem(value: IListItens) {
    localStorage.setItem(
      '@my-list',
      JSON.stringify([...this.#setListItens(), value])
    );

    return this.#setListItens.set(this.#parseItens());
  }

  public deleteAllItems() {
    localStorage.removeItem('@my-list');
    return this.#setListItens.set(this.#parseItens());
  }
}
