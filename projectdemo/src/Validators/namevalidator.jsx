const validateInput = (name, value) => {
  const patterns = {
    identifier: /^(?![-_])[a-zA-Z0-9-_]{8,16}(?<![-_])|^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    password: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,16}$/,
    name: /^.+$/,
    phone: /^\d{10}$/,
  };
 
  if (!value.trim()) {
    return "This field is required";
  }
 
  if (patterns[name] && !patterns[name].test(value)) {
    return `Invalid ${name}`;
  }
 
  return "";
};
 
const validateForm = (formData) => {
  const errors = {};
  for (const [key, value] of Object.entries(formData)) {
    const error = validateInput(key, value);
    if (error) errors[key] = error;
  }
  return errors;
};
 
export { validateInput, validateForm };