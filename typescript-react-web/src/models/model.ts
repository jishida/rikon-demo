import { startOfDay, startOfMonth } from 'date-fns';

import Config from './config';
import Parent from './parent';
import Child from './child';
import ParentalAuthority from './parental_authority';
import Solatium from './solatium';
import Division from './division';
import Meeting from './meeting';

import { NotifierMessage, Serverity } from '../components/parts';
import {
  Couple,
  DEFAULT_SUBMISSION_DESTINATION,
  wife,
} from '../utils/constants';
import { ControlContainer } from '../utils/hooks';
import { nonEmpty } from '../utils/validators';
import * as printers from '../utils/printers';

export default class Model extends ControlContainer {
  private _notificationPrevKey = 0;
  private _notificationShiftIgnore: number = 0;

  readonly children = this.array<Child>([]);
  readonly notifications = this.array<NotifierMessage>([]);

  readonly currentDate = startOfDay(new Date());
  readonly currentMonth = startOfMonth(this.currentDate);

  readonly config = new Config(this);
  readonly couple = [new Parent(this, true), new Parent(this, false)];
  readonly parentalAuthority = new ParentalAuthority(this);
  readonly solatium = new Solatium(this);
  readonly division = new Division(this);
  readonly meeting = new Meeting(this);

  readonly creationDate = this.state(this.currentDate);
  readonly submitter = this.state(wife);
  readonly submissionDate = this.state(this.currentDate);
  readonly submissionDestination = this.validatable(
    DEFAULT_SUBMISSION_DESTINATION,
    nonEmpty
  );
  readonly notarizedDoc = this.state<number>(1);

  readonly childrenAdd = this.control();
  readonly childrenRemove = this.control();
  readonly printButton = this.control();
  readonly configButton = this.control();

  readonly solatiumSwitch = this.state<boolean>(false);
  readonly divisionSwitch = this.state<boolean>(false);
  readonly meetingSwitch = this.state<boolean>(false);

  constructor() {
    super();
    this.handleChildrenOrAbbrevsChanged();
    this.solatium.updateAvailability();
    this.parentalAuthority.updateAvailability();
    this.division.updateAvailability();
    this.meeting.updateAvailability();
  }

  get hasband() {
    return this.couple[0];
  }

  get wife() {
    return this.couple[1];
  }

  handleChildrenOrAbbrevsChanged() {
    const ok = this.config.abbrevs.length > this.children.length + 2;
    this.childrenAdd.enabled = ok;
    this.childrenRemove.enabled = this.children.length > 0;
    this.config.abbrevAdd.enabled = this.config.abbrevs.length < 100;
    this.config.abbrevRemove.enabled = ok;
  }

  readonly abbr = (couple: Couple) => this[couple].abbrev;

  readonly printWithLiteral = () => {
    printers.printWithLiteral(this);
  };

  handleChildrenChange() {
    this.solatium.updateAvailability();
    this.parentalAuthority.updateAvailability();
    this.meeting.updateAvailability();
  }

  readonly pushChild = () => {
    if (this.childrenAdd.actualEnabled) {
      const child = new Child(this, this.children.length);
      this.children.push(child);
      this.handleChildrenOrAbbrevsChanged();
      this.handleChildrenChange();
      this.notify('info', `子供${this.children.length}を追加しました。`);
    }
  };

  readonly popChild = () => {
    if (this.childrenRemove.actualEnabled) {
      const child = this.children.pop();
      child.dispose();
      this.handleChildrenOrAbbrevsChanged();
      this.handleChildrenChange();
      this.notify('info', `子供${this.children.length + 1}を削除しました。`);
    }
  };

  protected validateImpl() {
    if (!this.config.validate()) {
      this.config.showDialog();
      this.notify('error', '設定に不正な値があります。');
      return false;
    }
    if (!super.validateImpl()) {
      this.notify('error', '入力項目に不正な値があります。');
      return false;
    }
    return true;
  }

  readonly clearNotifications = () => {
    this._notificationShiftIgnore += this.notifications.splice(0).length;
  };

  readonly notify = (serverity: Serverity, message: string) => {
    this.notifications.push({
      serverity,
      message,
      key: ++this._notificationPrevKey,
    });
    console.info(`notification (${serverity}): ${message}`);
    setTimeout(() => {
      if (this._notificationShiftIgnore > 0) {
        this._notificationShiftIgnore--;
      } else {
        this.notifications.shift();
      }
    }, 8000);
  };
}
