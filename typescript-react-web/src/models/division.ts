import Model from './model';
import { Couple, hasband, UINT_MAX_VALUE } from '../utils/constants';
import { State, ControlContainer } from '../utils/hooks';
import { uintRange } from '../utils/parsers';
import { bgcolor } from '../utils';

export default class Division extends ControlContainer {
  private _model: Model;

  readonly debtor = this.state<Couple>(hasband);
  readonly amount = this.parsable('', uintRange(1, UINT_MAX_VALUE));
  readonly paymentDate: State<Date>;

  readonly available = this.state<boolean>(false);

  constructor(model: Model) {
    super({ container: model });
    this._model = model;
    this.paymentDate = this.state(model.currentDate);
  }

  get bgcolor() {
    return bgcolor(this.available.value);
  }

  use() {
    this.available.use();
  }

  updateAvailability() {
    const checked = this._model.divisionSwitch.value;
    this.enabled = checked;
    this.validateEnabled = checked;
    this.available.value = checked;
  }

  readonly onSwitchChanged = () => {
    this.updateAvailability();
  };
}
