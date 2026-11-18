import type { AuthFieldProps } from "@/app/_types";

export default function AuthField({
  id,
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
  icon,
}: AuthFieldProps) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span className="auth-field-label">{label}</span>
      <span className="auth-input-wrap">
        {icon}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />
      </span>
    </label>
  );
}
