export const validatePassword = (password, email) => {
    const username = email.split("@")[0].toLowerCase();
    const pass = password.toLowerCase();
  
    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long",
      };
    }
  
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password); // simbol atau underscore
  
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) {
      return {
        success: false,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      };
    }
  
    if (pass.includes(username)) {
      return {
        success: false,
        message: "Password should not contain part of the email",
      };
    }
  
    return { success: true };
  };
  