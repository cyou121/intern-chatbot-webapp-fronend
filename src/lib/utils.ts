export const validatePassword = (password: string): string => {
  if (password.length === 0) {
    return "パスワードを入力してください";
  }
  if (password.length <= 4 || !/^(?=.*[a-zA-Z]{4,}).{5,}$/.test(password)) {
    return "半角英字4文字以上、5文字以上で入力してください";
  }
  return "";
};
