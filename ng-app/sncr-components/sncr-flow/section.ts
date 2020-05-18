export class Section {
  active?: boolean;
  alreadyActivated = false;
  disabled = true;
  prevModel = {};
  changed = false;
  reload = true;

  get model() {
    return this._model;
  }

  set model(value: any) {
    if (this.active) {
      this._model = value;
    }
  }

  private _model = {};
}

export class Sections {
  list: Section[] = [];
  model = {};
}