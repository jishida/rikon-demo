import Model from './model';
import { ControlContainer } from '../utils/hooks';
import { nonEmpty } from '../utils/validators';
import { bgcolor } from '../utils';
import {
  DEFAULT_MEETING_LIMIT,
  DEFAULT_NEGOTIATION_LIMIT,
} from '../utils/constants';

export default class Meeting extends ControlContainer {
  private _model: Model;

  readonly meetingLimit = this.validatable(DEFAULT_MEETING_LIMIT, nonEmpty);
  readonly negotiationLimit = this.validatable(
    DEFAULT_NEGOTIATION_LIMIT,
    nonEmpty
  );

  readonly available = this.state<boolean>(false);

  constructor(model: Model) {
    super({ container: model });
    this._model = model;
  }

  get bgcolor() {
    return bgcolor(this.available.value);
  }

  use() {
    this.available.use();
  }

  readonly onSwitchChanged = () => {
    this.updateAvailability();
  };

  updateAvailability() {
    const switchEnabled = this._model.children.length > 0;
    this._model.meetingSwitch.enabled = switchEnabled;
    const enabled = switchEnabled && this._model.meetingSwitch.value;
    this.available.value = enabled;
    this.enabled = enabled;
    this.validateEnabled = enabled;
  }
}
