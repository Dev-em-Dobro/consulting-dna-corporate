"use client";

import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";

type FieldKey = "name" | "email" | "organisation" | "message";
type Values = Record<FieldKey, string>;
type Errors = Partial<Record<FieldKey, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.email.trim()) e.email = "Please enter your work email.";
  else if (!EMAIL_RE.test(v.email.trim()))
    e.email = "Please enter a valid email address.";
  if (!v.message.trim())
    e.message = "Please tell us about the challenge you are facing.";
  return e;
}

const inputBase =
  "border bg-[#fafafa] px-3.5 py-3 text-[15px] text-ink outline-none focus:bg-white";

const labelCls =
  "text-[12px] font-semibold uppercase tracking-[0.5px] text-muted";

export default function ContactForm() {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    organisation: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const update =
    (key: FieldKey) =>
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [key]: ev.target.value };
      setValues(next);
      if (touched[key]) setErrors(validate(next));
    };

  const markTouched =
    (key: FieldKey) =>
    (_ev: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched((t) => ({ ...t, [key]: true }));
      setErrors(validate(values));
    };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, organisation: true, message: true });
    if (Object.keys(errs).length === 0) {
      // No backend wired yet — this is where the submission would be sent.
      setSubmitted(true);
    }
  };

  const inputCls = (key: FieldKey) =>
    `${inputBase} ${
      errors[key]
        ? "border-red-500 focus:border-red-500"
        : "border-[#d9d5d1] focus:border-brand"
    }`;

  const errorEl = (key: FieldKey) =>
    errors[key] ? (
      <span
        id={`err-${key}`}
        role="alert"
        className="text-[12.5px] leading-snug text-red-600"
      >
        {errors[key]}
      </span>
    ) : null;

  if (submitted) {
    return (
      <div className="flex flex-col gap-3 bg-white p-[34px]">
        <p className="text-[12px] font-bold uppercase tracking-[1px] text-brand">
          Thank you
        </p>
        <p className="text-[18px] leading-relaxed text-ink">
          We’ve received your message and will respond with a considered,
          confidential point of view — not a sales pitch.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-white p-[34px]"
    >
      <label className="flex flex-col gap-[7px]">
        <span className={labelCls}>
          Name <span className="text-brand">*</span>
        </span>
        <input
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={values.name}
          onChange={update("name")}
          onBlur={markTouched("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "err-name" : undefined}
          className={inputCls("name")}
        />
        {errorEl("name")}
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelCls}>
          Work email <span className="text-brand">*</span>
        </span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={values.email}
          onChange={update("email")}
          onBlur={markTouched("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
          className={inputCls("email")}
        />
        {errorEl("email")}
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelCls}>Organisation</span>
        <input
          type="text"
          autoComplete="organization"
          placeholder="Company name"
          value={values.organisation}
          onChange={update("organisation")}
          className={inputCls("organisation")}
        />
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className={labelCls}>
          What leadership challenge are you addressing?{" "}
          <span className="text-brand">*</span>
        </span>
        <textarea
          rows={3}
          placeholder="Write as much as you like."
          value={values.message}
          onChange={update("message")}
          onBlur={markTouched("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          className={`resize-y ${inputCls("message")}`}
        />
        {errorEl("message")}
      </label>

      <button
        type="submit"
        className="mt-1 cursor-pointer bg-ink px-4 py-4 text-sm font-bold uppercase tracking-[0.5px] text-white hover:bg-[#2a2627]"
      >
        Start a Conversation
      </button>
    </form>
  );
}
