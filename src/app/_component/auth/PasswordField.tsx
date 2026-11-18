"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import type { PasswordFieldProps } from "@/app/_types";
import { getDictionary } from "@/lib/dictionary";
import { usePreferences } from "../preferences/Preferences";

export default function PasswordField({
  id,
  name,
  placeholder,
  autoComplete,
  required = true,
  minLength,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const { locale } = usePreferences();
  const t = getDictionary(locale);

  return (
    <label className="auth-field" htmlFor={id}>
      <span className="auth-input-wrap">
        <FiLock />

        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength || undefined}
          onChange={onChange}
        />

        <button
          type="button"
          className="password-visibility"
          aria-label={visible ? t.hidePassword : t.showPassword}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </span>
    </label>
  );
}
