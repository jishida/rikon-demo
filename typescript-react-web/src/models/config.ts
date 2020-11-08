import Model from './model';
import { abbrevs } from '../utils/constants';
import { ValidatableState, ControlContainer } from '../utils/hooks';
import { nonEmpty } from '../utils/validators';

export default class Config extends ControlContainer {
  private _model: Model;
  private _visible = this.state<boolean>(false);
  private _abbrevs = this.array<ValidatableState<string>>(
    abbrevs.map((a) => this.validatable(a, nonEmpty))
  );

  readonly abbrevAdd = this.control();
  readonly abbrevRemove = this.control();

  constructor(model: Model) {
    super({ container: model, inheritsValidation: false });
    this._model = model;
  }

  get abbrevs() {
    return this._abbrevs.value;
  }

  get visible() {
    return this._visible.value;
  }

  use() {
    this._abbrevs.use();
    this._visible.use();
  }

  readonly pushAbbrev = () => {
    if (this.abbrevAdd.actualEnabled) {
      const abbrev =
        abbrevs.length > this.abbrevs.length
          ? abbrevs[this.abbrevs.length]
          : '';
      const item = this.validatable(abbrev, nonEmpty);
      this._abbrevs.push(item);
      this._model.handleChildrenOrAbbrevsChanged();
      this._model.notify(
        'info',
        `"略称${this.abbrevs.length}"を追加しました。`
      );
    }
  };

  readonly popAbbrev = () => {
    if (this.abbrevRemove.actualEnabled) {
      const item = this._abbrevs.pop();
      item.dispose();
      this._model.handleChildrenOrAbbrevsChanged();
      this._model.notify(
        'info',
        `"略称${this.abbrevs.length + 1}"を削除しました。`
      );
    }
  };

  readonly showDialog = () => {
    this._visible.value = true;
  };

  readonly closeDialog = () => {
    this._visible.value = false;
  };
}
