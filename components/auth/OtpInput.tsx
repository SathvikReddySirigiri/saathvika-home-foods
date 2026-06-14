"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

const OTP_LENGTH = 6;

export function OtpInput({ value, onChange, disabled, error }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  const focusIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(OTP_LENGTH - 1, index));
    inputRefs.current[clamped]?.focus();
    inputRefs.current[clamped]?.select();
  }, []);

  const setDigits = useCallback(
    (nextDigits: string[]) => {
      onChange(nextDigits.join("").replace(/\s/g, "").slice(0, OTP_LENGTH));
    },
    [onChange],
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits.map((d) => (d === " " ? "" : d))];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      const current = digits[index]?.trim();
      if (current) {
        const next = [...digits.map((d) => (d === " " ? "" : d))];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focusIndex(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusIndex(index - 1);
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    setDigits(pasted.split(""));
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div
      className="flex justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit.trim()}
          disabled={disabled}
          aria-invalid={error}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={`h-12 w-10 rounded-xl border bg-white text-center font-sans text-lg font-semibold text-brand-green outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/25 sm:h-14 sm:w-12 sm:text-xl ${
            error
              ? "border-brand-red/50 focus:border-brand-red focus:ring-brand-red/20"
              : "border-brand-gold/35"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        />
      ))}
    </div>
  );
}
