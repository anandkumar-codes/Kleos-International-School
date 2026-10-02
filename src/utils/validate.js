// Small composable validators: each returns an error string or ''.

export const required = (label) => (v) => (String(v ?? '').trim() ? '' : `${label} is required`);
export const minLen = (n, label) => (v) => (String(v ?? '').trim().length >= n ? '' : `${label} must be at least ${n} characters`);
export const email = (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address');
export const phoneIN = (v) => (!v || /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(String(v).trim()) ? '' : 'Enter a valid 10-digit Indian mobile number');
export const positive = (label) => (v) => (Number(v) > 0 ? '' : `${label} must be greater than zero`);

export function validate(values, schema) {
  const errors = {};
  for (const [key, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const msg = rule(values[key], values);
      if (msg) {
        errors[key] = msg;
        break;
      }
    }
  }
  return errors;
}
