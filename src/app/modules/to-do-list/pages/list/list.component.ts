import { IListItens } from './../../interface/IListItem.interface';
import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { ELocalStorage } from '../../enum/ELocalStarge.enum';

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
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]');
  }

  #updateLocalStorage() {
    return localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify(this.#setListItens())
    );
  }

  public getInputAndAddItem(value: IListItens) {
    localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify([...this.#setListItens(), value])
    );

    return this.#setListItens.set(this.#parseItens());
  }

  public listItemsStage(value: 'pending' | 'completed') {
    return this.getListItens().filter((res: IListItens) => {
      if (value === 'pending') {
        return !res.checked;
      }
      if (value === 'completed') {
        return res.checked;
      }
      return res;
    });
  }

  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItens.update((oldValue: IListItens[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.checked = newItem.checked;
          return res;
        }

        return res;
      });
      return oldValue;
    });
    return this.#updateLocalStorage();
  }

  public updateItemText(newItem: { id: string; value: string }) {
    this.#setListItens.update((oldValue: IListItens[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.value = newItem.value;
          return res;
        }

        return res;
      });
      return oldValue;
    });
    return localStorage.setItem(
      '@my-list',
      JSON.stringify(this.#setListItens())
    );
  }

  public deleteItem(id: string) {
    this.#setListItens.update((oldValue: IListItens[]) => {
      return oldValue.filter((res) => res.id !== id);
    });

    return this.#updateLocalStorage();
  }

  public deleteAllItems() {
    localStorage.removeItem(ELocalStorage.MY_LIST);
    return this.#setListItens.set(this.#parseItens());
  }
}
