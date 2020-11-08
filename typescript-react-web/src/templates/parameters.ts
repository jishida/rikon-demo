import Model from '../models/model';
import ChildModel from '../models/child';
import { finalizeLazy, lazy } from '../utils/lazy';
import { Couple, opponents } from '../utils/constants';
import { addMonths } from 'date-fns';

function opponent(couple: Couple) {
  return opponents[couple];
}

export class Child {
  private _model: ChildModel;

  readonly name = lazy(() => this._model.name.value);
  readonly abbrev = lazy(() => this._model.abbrev);
  readonly relation = lazy(() => this._model.relation.value);
  readonly birthday = lazy(() => this._model.birthday.value);
  readonly supportAmount = lazy(() => this._model.supportAmount.result || 0);
  readonly supportEndMonth = lazy(() =>
    this._model.supportEndMonthSwitch.value
      ? this._model.supportEndMonth.value
      : null
  );

  constructor(model: ChildModel) {
    this._model = model;
    finalizeLazy(this);
  }
}

export class Parameters {
  private _model: Model;

  readonly hasbandName = lazy(() => this._model.hasband.name.value);
  readonly wifeName = lazy(() => this._model.wife.name.value);
  readonly children = lazy(() =>
    this._model.children.value.map((c) => new Child(c))
  );
  readonly parentalAuthorityEnabled = lazy(
    () => this._model.parentalAuthority.validateEnabled
  );
  readonly parentalAuthority = lazy(
    () => this._model.parentalAuthority.person.value
  );
  readonly supportEnabled = lazy(
    () => this.parentalAuthorityEnabled && this.supportTotalAmount > 0
  );
  readonly supportCreditor = lazy(
    () => this._model.parentalAuthority.supportCreditor.value
  );
  readonly supportDebtor = lazy(() => opponent(this.supportCreditor));
  readonly supportStartMonth = lazy(
    () => this._model.parentalAuthority.supportStartMonth.value
  );
  readonly supportTotalAmount = lazy(() =>
    this._model.children.value
      .map((child) => (child.supportAmount.result || 0) * child.supportCount)
      .reduce((acc, cur) => acc + cur)
  );

  readonly solatiumEnabled = lazy(() => this._model.solatium.validateEnabled);
  readonly solatiumCreditor = lazy(() => opponent(this.solatiumDebtor));
  readonly solatiumDebtor = lazy(() => this._model.solatium.debtor.value);
  readonly solatiumAmount = lazy(() => this._model.solatium.amount.result);
  readonly solatiumCount = lazy(() => this._model.solatium.count.result);
  readonly solatiumStartMonth = lazy(
    () => this._model.solatium.startMonth.value
  );
  readonly solatiumEndMonth = lazy(() =>
    addMonths(this.solatiumStartMonth, this.solatiumCount - 1)
  );
  readonly solatiumTotalAmount = lazy(
    () => this.solatiumAmount * this.solatiumCount
  );

  readonly divisionEnabled = lazy(() => this._model.division.validateEnabled);
  readonly divisionCreditor = lazy(() => opponent(this.divisionDebtor));
  readonly divisionDebtor = lazy(() => this._model.division.debtor.value);
  readonly divisionAmount = lazy(() => this._model.division.amount.result);
  readonly divisionPaymentDate = lazy(
    () => this._model.division.paymentDate.value
  );

  readonly meetingEnabled = lazy(() => this._model.meeting.validateEnabled);
  readonly meetingLimit = lazy(() => this._model.meeting.meetingLimit.value);
  readonly negotiationLimit = lazy(
    () => this._model.meeting.negotiationLimit.value
  );

  readonly creationDate = lazy(() => this._model.creationDate.value);
  readonly submitter = lazy(() => this._model.submitter.value);
  readonly submissionDate = lazy(() => this._model.submissionDate.value);
  readonly submissionDestination = lazy(
    () => this._model.submissionDestination.value
  );
  readonly notarizedDoc = lazy(() => !!this._model.notarizedDoc.value);

  constructor(context: Model) {
    this._model = context;
    finalizeLazy(this);
  }
}

export function createParameters(context: Model): Parameters | null {
  return context.validate() ? new Parameters(context) : null;
}
