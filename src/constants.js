import keymirror from 'keymirror';

export class LogicException {
  constructor(msg, status = 401) {
    this.msg = msg;
    this.status = status;
  }
}

export const Roles = keymirror({
  user: null,
  admin: null,
  guest: null,
});

