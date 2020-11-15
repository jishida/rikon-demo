import { addYears, differenceInMonths, startOfMonth } from 'date-fns';

import Model from './model';
import { UINT_MAX_VALUE } from '../utils/constants';
import { State, ControlContainer } from '../utils/hooks';
import { formatMonth } from '../utils/formatters';
import { nonEmpty } from '../utils/validators';
import { nullableUintRange } from '../utils/parsers';

export default class Child extends ControlContainer {
  private _model: Model;
  private _index: number;
  private _supportCount?: number;

  readonly name = this.validatable('', nonEmpty);
  readonly relation = this.validatable('', nonEmpty);
  readonly birthday: State<Date>;
  readonly supportAmount = this.parsable(
    '',
    nullableUintRange(0, UINT_MAX_VALUE)
  );
  readonly supportEndMonthSwitch = this.state<boolean>(false);
  readonly supportEndMonth: State<Date>;

  readonly alertMessage = this.state('');

  constructor(model: Model, index: number) {
    super({ container: model });
    this._model = model;
    this._index = index;
    this.birthday = this.state(model.currentDate);
    this.supportEndMonth = this.state(model.currentMonth);
    this.supportEndMonth.enabled = false;
  }

  use() {
    this.alertMessage.use();
  }

  get index() {
    return this._index;
  }

  get abbrev() {
    return this._model.config.abbrevs[this._index + 2].value;
  }

  get supportCount(): number {
    return this._supportCount;
  }

  readonly onSupportEndMonthSwitchChanged = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.supportEndMonth.enabled = checked;
  };

  protected validateImpl() {
    const ok = super.validateImpl();
    if (!this.supportAmount.hasError && (this.supportAmount.result || 0) > 0) {
      const start = this._model.parentalAuthority.supportStartMonth.value;
      const end = this.supportEndMonth.enabled
        ? this.supportEndMonth.value
        : addYears(startOfMonth(this.birthday.value), 20);
      this._supportCount = differenceInMonths(end, start) + 1;
      if (this.supportCount < 1) {
        this.alertMessage.value = `養育費支払い終了月${formatMonth(
          end
        )}が、支払い開始月${formatMonth(start)}より先の日付になっています。`;
        return false;
      }
    } else {
      this._supportCount = 0;
    }
    this.alertMessage.value = '';
    return ok;
  }
}
