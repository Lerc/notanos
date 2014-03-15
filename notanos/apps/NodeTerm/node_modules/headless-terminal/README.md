# new HeadlessTerminal(cols, rows)

A headless terminal is a terminal with an internal screen buffer.

When the display is changed, the `change` event is emitted
with the display buffer as an argument.

__Note:__ Since v0.3 the API has been _completely changed_.


## Usage

```javascript
var HeadlessTerminal = require('headless-terminal')
var terminal = new HeadlessTerminal(80, 25)
terminal.write('write some data and ansi code')
console.log(terminal.displayBuffer.toString())
```

## Attributes

### displayBuffer

The underlying [screen-buffer](http://github.com/dtinth/screen-buffer)

## API

HeadlessTerminal inherits EventEmitter.

### write(whatever)

Writes some thing to the terminal.
After that, a change event will be emitted.

### resize(cols, rows)

Resizes the size of the terminal.
After that, a change event will be emitted.

## Events

### 'change' (buffer)

Emitted when something is written to the terminal.
The first argument will be the underlying screen-buffer.

## Static Members

### HeadlessTerminal.ScreenBuffer

The ScreenBuffer class.

## License

MIT

