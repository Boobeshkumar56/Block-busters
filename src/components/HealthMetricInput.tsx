
import React from "react";
import { cn } from "@/lib/utils";

interface HealthMetricInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helperText?: string;
  unit?: string;
  readOnly?: boolean;
}

const HealthMetricInput: React.FC<HealthMetricInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  min,
  max,
  step,
  required = false,
  helperText,
  unit,
  readOnly = false
}) => {
  return (
    <div className={cn("mb-4", className)}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-health-600">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          readOnly={readOnly}
          className={cn("health-input", readOnly && "bg-gray-100 cursor-not-allowed")}
        />
        {unit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {unit}
          </div>
        )}
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default HealthMetricInput;
