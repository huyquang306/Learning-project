export const MAX_NUMBER_CHARS_PASSWORD = 50;
export const MIN_NUMBER_CHARS_PASSWORD = 8;
export const PASSWORD_POLICY_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const PASSWORD_CONTAINS_ALLOW_SYMBOL = /^([a-zA-Z0-9!@#$%^&*]*)$/;
export const convertTwoBytesCharacter = (value) => {
  return value.replace(/[Ａ-Ｚａ-ｚ０-９！＠＃＄％＾＆＊]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}