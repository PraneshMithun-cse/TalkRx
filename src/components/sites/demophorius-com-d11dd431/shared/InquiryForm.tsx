"use client";

import { useState } from "react";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "file";
  required?: boolean;
}

export function InquiryForm({
  detailsHeader,
  fields,
  radioGroup,
  textarea,
  successMessage,
}: {
  detailsHeader: string;
  fields: FormField[];
  radioGroup?: { label: string; options: string[] };
  textarea?: { label: string; placeholder: string };
  successMessage: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[10px] border border-black/10 p-10 text-center text-lg uppercase tracking-wide">
        {successMessage}
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-8 lg:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (accepted) setSubmitted(true);
      }}
    >
      <div className="rounded-[10px] border border-black/10 p-6 lg:p-8">
        <div className="text-sm font-medium uppercase tracking-wide">{detailsHeader}</div>
        <hr className="mt-4 border-t border-black/20" />
        {fields.map((f) => (
          <div key={f.name} className="border-b border-black/10 py-4">
            <label htmlFor={f.name} className="text-xs uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
              {f.label}
              {f.required && <sup>*</sup>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              className="mt-2 w-full border-0 border-b border-transparent bg-transparent text-base outline-none focus:border-black"
            />
          </div>
        ))}
      </div>

      <div className="rounded-[10px] border border-black/10 p-6 lg:p-8">
        {radioGroup && (
          <>
            <div className="text-xs uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
              {radioGroup.label}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {radioGroup.options.map((opt) => (
                <label key={opt} className="flex items-center gap-3 text-sm">
                  <input type="radio" name="department" value={opt} className="h-4 w-4" />
                  {opt}
                </label>
              ))}
            </div>
            <hr className="mt-6 border-t border-black/20" />
          </>
        )}
        {textarea && (
          <div className="mt-6">
            <label className="text-xs uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
              {textarea.label}
            </label>
            <textarea
              rows={5}
              placeholder={textarea.placeholder}
              className="mt-2 w-full resize-none border-b border-black/20 bg-transparent text-base outline-none focus:border-black"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-6 lg:col-span-2 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex items-center gap-3 text-xs uppercase tracking-[1px]">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="h-4 w-4" />
          By completing and sending your data, you agree to the{" "}
          <a href="https://demophorius.com/privacy-policy/" className="underline">
            privacy policy
          </a>
          .
        </label>
        <button
          type="submit"
          className="rounded-full bg-black px-8 py-4 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          disabled={!accepted}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
