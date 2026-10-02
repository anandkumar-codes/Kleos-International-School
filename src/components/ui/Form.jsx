import { useState } from 'react';
import { CircleAlert, Search } from 'lucide-react';
import { validate } from '../../utils/validate';

export function Field({ label, required, error, hint, children, className = '' }) {
  return (
    <label className={`field ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <span className="field__label">
          {label}
          {required && <span className="req" aria-hidden>*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="field__error" role="alert">
          <CircleAlert size={14} aria-hidden /> {error}
        </span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </label>
  );
}

export function Input({ label, required, error, hint, className, ...rest }) {
  return (
    <Field label={label} required={required} error={error} hint={hint} className={className}>
      <input className="input" aria-invalid={!!error} required={required} {...rest} />
    </Field>
  );
}

export function Select({ label, required, error, hint, options = [], placeholder, className, ...rest }) {
  return (
    <Field label={label} required={required} error={error} hint={hint} className={className}>
      <select className="select" aria-invalid={!!error} required={required} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </Field>
  );
}

export function Textarea({ label, required, error, hint, className, ...rest }) {
  return (
    <Field label={label} required={required} error={error} hint={hint} className={className}>
      <textarea className="textarea" aria-invalid={!!error} required={required} {...rest} />
    </Field>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '', ...rest }) {
  return (
    <div className={`search ${className}`}>
      <Search aria-hidden />
      <input className="input" type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} {...rest} />
    </div>
  );
}

export function Switch({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}

// Lightweight form state + validation (touched-aware, validates on blur and submit).
export function useForm(initial, schema = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const bind = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => {
      const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setValues((s) => ({ ...s, [name]: v }));
      if (touched[name]) setErrors((er) => ({ ...er, [name]: validate({ ...values, [name]: v }, { [name]: schema[name] || [] })[name] }));
    },
    onBlur: () => {
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors((er) => ({ ...er, [name]: validate(values, { [name]: schema[name] || [] })[name] }));
    },
    error: errors[name],
  });

  const submit = (fn) => (e) => {
    e?.preventDefault();
    const errs = validate(values, schema);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(schema).map((k) => [k, true])));
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    fn(values);
  };

  const reset = (v = initial) => {
    setValues(v);
    setErrors({});
    setTouched({});
  };

  return { values, setValues, errors, bind, submit, reset };
}
