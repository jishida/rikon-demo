import Model from './model';
import { Couple, hasband, UINT_MAX_VALUE } from '../utils/constants';
import { State, ControlContainer } from '../utils/hooks';
import { uintRange } from '../utils/parsers';
import { bgcolor } from '../utils';

export default class Solatium extends ControlContainer {
  private _model: Model;

  readonly debtor = this.state<Couple>(hasband);
  readonly amount = this.parsable('', uintRange(1, UINT_MAX_VALUE));
  readonly count = this.parsable('1', uintRange(1, 999));
  readonly startMonth: State<Date>;

  readonly available = this.state<boolean>(false);

  constructor(model: Model) {
    super({ container: model });
    this._model = model;
    this.startMonth = this.state(model.currentMonth);
  }

  use() {
    this.available.use();
  }

  get bgcolor() {
    return bgcolor(this.available.value);
  }

  readonly onSwitchChanged = () => {
    this.updateAvailability();
  };

  updateAvailability() {
    const checked = this._model.solatiumSwitch.value;
    this.available.value = checked;
    this.enabled = checked;
    this.validateEnabled = checked;
  }
}
