# NIME

Implement input methods easily for Windows with nodejs. It is another [PIME](https://github.com/EasyIME/PIME) server side.

## Require

### PIME

Install PIME first. There are two ways to install.

- Install via [installer](https://github.com/EasyIME/PIME/releases)
- Build the PIME source code and register `PIMETextService.dll`. Please see [this](https://github.com/EasyIME/PIME#install) for more detail

#### Node

- Node v14.x+

## Development

- `npm i`
- `npm start`

It would start [meow](/example/meow/README.md) example server to help develop core library.

## Usage

```bash
npm install nime
```

> This is WIP project. You can see example in `./example`.

`ime.json` is to configure IME.

Example for implementing IME.
- [reduce-based](/example/meow/README.md): It uses the `textReducer` and `response` function to handle text and request.

## Reference

- [PIME](https://github.com/EasyIME/PIME)
- [Virtual-Key Codes](https://msdn.microsoft.com/zh-tw/library/windows/desktop/dd375731%28v=vs.85%29.aspx)

## License

MIT
