// TODO 判断类型
export const createKeyHandler = (msg) => {
    console.log(`MSG:\t`, msg)

    let {
        charCode, keyCode, repeatCount, scanCode, isExtended, keyStates
    } = msg;

    function isKeyDown(code: number) {
        return keyStates ? (keyStates[code] & 0x80) !== 0 : false;
    }

    function isKeyToggled(code: number) {
        return keyStates ? (keyStates[code] & 1) !== 0 : false;
    }

    function isChar() {
        return charCode ? (charCode !== 0) : false;
    }

    return { isKeyDown, isKeyToggled, isChar };
}
