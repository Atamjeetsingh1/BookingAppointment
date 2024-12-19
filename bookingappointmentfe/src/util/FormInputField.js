import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

const FormInputField = ({
  label,
  name,
  value,
  onChange,
  maxLength,
  required = false,
  type,
  disabled = false,
}) => (
  <FormGroup className="w-80">
    <Label htmlFor={name} className="labelsss">
      {label}
      {required && <em style={{ color: "red" }}>*</em>}
    </Label>
    <Input
      type={type}
      value={value}
      name={name}
      id={name}
      onChange={onChange}
      maxLength={maxLength}
      disabled={disabled}
    />
  </FormGroup>
);

export default FormInputField;