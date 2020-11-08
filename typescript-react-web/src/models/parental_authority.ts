import Model from './model';
import { Couple, wife } from '../utils/constants';
import { State, ControlContainer } from '../utils/hooks';
import { bgcolor } from '../utils';

export default class ParentalAuthority extends ControlContainer {
  private _model: Model;

  readonly person = this.state<Couple>(wife);
  readonly supportCreditor = this.state<Couple>(wife);
  readonly supportStartMonth: State<Date>;

  readonly available = this.state<boolean>(false);

  constructor(model: Model) {
    super({ container: model });
    this._model = model;
    this.supportStartMonth = this.state(model.currentMonth);
  }

  get bgcolor() {
    return bgcolor(this.available.value);
  }

  use() {
    this.available.use();
  }

  updateAvailability() {
    const enabled = this._model.children.length > 0;
    this.available.value = enabled;
    this.enabled = enabled;
    this.validateEnabled = enabled;
  }
}
