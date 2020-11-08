import Model from './model';
import { coupleTitles, hasband, wife } from '../utils/constants';
import { ControlContainer } from '../utils/hooks';
import { nonEmpty } from '../utils/validators';

export default class Parent extends ControlContainer {
  private _model: Model;
  private _isHasband: boolean;

  readonly name = this.validatable('', nonEmpty);

  constructor(model: Model, isHasband: boolean) {
    super({ container: model });
    this._model = model;
    this._isHasband = isHasband;
  }

  get key() {
    return this._isHasband ? hasband : wife;
  }

  get title() {
    return coupleTitles.get(this.key);
  }

  get abbrev() {
    return this._model.config.abbrevs[this._isHasband ? 0 : 1].value;
  }
}
