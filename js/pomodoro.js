'use strict';

const e = React.createElement;

const MINUTE = 60000;

let timerID = 0;

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      pause: true,
      label: 'session'
    };
    this.value = this.state.session * MINUTE;
    this.start = Date.now();
    this.odd = false;

    this.onTimer = this.onTimer.bind (this);
    this.reset = this.reset.bind (this);
    this.toggle = this.toggle.bind (this);
  }

  componentDidMount () {
    timerID = setInterval (this.onTimer, 1000);
  }

  componentWillUnmount () {
    if (timerID) {
      clearTimeout (timerId);
      timerID = 0;
    }
  }

  onTimer () {
    let p = document.getElementById ('time-left');
    let now = Date.now();
    let d = (now - this.start);
    this.odd = !this.odd;
    if (!this.state.pause) {
      this.start = now;
      this.value -= d;
      if (Math.round(this.value/1000) == 0) {
        if (this.value < 0) this.value = 0;
        this.beep ();
      } else if (this.value < 0) {
        let l = 'break';
        if (this.state.label == 'break')
          l = 'session';
        this.setState ({
          label: l
        });
        if (l == 'break') {
          this.value = this.state.break * MINUTE;
        } else this.value = this.state.session * MINUTE;
        p.innerHTML = this.getTimeLabel();
        p = document.getElementById ('timer-label');
        p.innerHTML = l;
        this.start = Date.now ();
        return;
      }
    }
    p.innerHTML = this.getTimeLabel();
  }

  toggle () {
    if (this.state.pause) this.start = Date.now();
    this.setState ({
      pause: !this.state.pause
    });
  }

  reset () {
    let p = document.getElementById ('time-left');
    this.value = 25 * MINUTE;
    p.innerHTML = this.getTimeLabel();
    this.setState ({
      break: 5,
      session: 25,
      pause: true,
      label: 'session'
    });
    this.beep (true);
  }

  beep (stop = false) {
    let p = document.getElementById ('beep');
    p.currentTime = 0;
    if (stop) p.pause();
    else p.play();
  }

  sessionUp () {
    let i = this.state.session + 1;
    if (i > 60) return;
    if (this.state.pause) this.value = i * MINUTE;
    this.setState ({ session: i });
  }

  sessionDown () {
    let i = this.state.session - 1;
    if (i < 1) return;
    if (this.state.pause) this.value = i * MINUTE;
    this.setState ({ session: i });
  }

  breakUp () {
    let i = this.state.break + 1;
    if (i > 60) return;
    this.setState ({ break: i });
  }

  breakDown () {
    let i = this.state.break - 1;
    if (i < 1) return;
    this.setState ({ break: i });
  }

  getTimeLabel () {
    let sec = this.value % MINUTE;
    let min = (this.value - sec) / MINUTE;
    sec = Math.floor (sec/1000);
    return (min<10 ? '0' : '') + min + ':' + (sec<10 ? '0' : '') + sec;
   }

  render() {
    let lon = this.state.pause ? {}:{background: 'radial-gradient(#fafafa,#a2aa9f)', border: '2px solid #e2eedf'};
    let logo = e ('a', {id: 'logo', href: "https://github.com/konkor/pomodoro"}, 'Pomodoro');
    let timer1 =  e ('div', {id: 'session-timer'},
      e ('div', {id: 'session-increment', className: 'updown', onClick: e => {this.sessionUp()}}, '▲'),
      e ('div', {id: 'session-length'}, this.state.session),
      e ('div', {className: 'units'}, 'min'),
      e ('div', {id: 'session-decrement', className: 'updown', onClick: e => {this.sessionDown()}}, '▼')
    );
    let timer2 =  e ('div', {id: 'break-timer'},
      e ('div', {id: 'break-increment', className: 'updown', onClick: e => {this.breakUp()}}, '▲'),
      e ('div', {id: 'break-length'}, this.state.break),
      e ('div', {className: 'units'}, 'min'),
      e ('div', {id: 'break-decrement', className: 'updown', onClick: e => {this.breakDown()}}, '▼')
    );
    let panel = e ('div', {id: 'panel'},
      e ('div', {}, logo,
        e ('div', {id: 'reset', onClick: this.reset, title: 'reset'}, '⏻')
      ),
      e ('div', {id: 'display', style: lon},
        e ('div', {id: 'timer-label'}, this.state.label),
        e ('div', {id: 'time-left'}, this.getTimeLabel())
      ),
      e ('div', {id: 'start_stop', onClick: this.toggle, title: 'start/pause'}, this.state.pause? 'start' : 'pause')
    );

    return e(
      'div',
      { id: 'pomodoro' },
      e ('div', {id: 'session-label', className: 'label'}, 'session'),
      timer1, panel, timer2,
      e ('div', {id: 'break-label', className: 'label'}, 'break'),
      e ('audio', {id:'beep', preload: "auto", src: './media/beep.ogg'}, null)
    );
  }
}

//e ('audio', {id:'beep', src: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'}, null)

function debug (...args) {
  console.log (...args);
}

const domContainer = document.querySelector('#pomodoro_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Pomodoro));
