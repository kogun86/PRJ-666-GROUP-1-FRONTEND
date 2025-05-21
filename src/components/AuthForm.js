import { useState } from 'react';
import Link from 'next/link';

export default function AuthForm({
  title,
  fields,
  submitLabel,
  onSubmit,
  loading,
  error,
  footerText,
  footerLinkText,
  footerLinkHref,
  additionalFooter,
}) {
  // Create state for each field
  const [fieldValues, setFieldValues] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(fieldValues);
  };

  // Group fields into rows based on their 'row' property
  const rowGroups = fields.reduce((acc, field) => {
    if (field.row !== undefined) {
      if (!acc[field.row]) {
        acc[field.row] = [];
      }
      acc[field.row].push(field);
    } else {
      // Add to "ungrouped" array for fields without row specification
      if (!acc.ungrouped) {
        acc.ungrouped = [];
      }
      acc.ungrouped.push(field);
    }
    return acc;
  }, {});

  // Render a single form field
  const renderField = (field) => {
    return (
      <div key={field.name} className="login-form-group" style={{ width: '100%' }}>
        <label htmlFor={field.name} className="login-label">
          {field.label}
        </label>
        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            value={fieldValues[field.name]}
            onChange={handleChange}
            className="login-input"
            required={field.required}
            style={{ width: '100%' }}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options &&
              field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <div
            className="login-checkbox-container"
            style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}
          >
            <input
              id={field.name}
              type="checkbox"
              name={field.name}
              checked={fieldValues[field.name]}
              onChange={(e) =>
                setFieldValues((prev) => ({
                  ...prev,
                  [field.name]: e.target.checked,
                }))
              }
              style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}
            />
            <span style={{ color: '#2f3e46' }}>{field.checkboxLabel}</span>
          </div>
        ) : (
          <input
            id={field.name}
            type={field.type}
            name={field.name}
            value={fieldValues[field.name]}
            onChange={handleChange}
            className={field.type === 'password' ? 'password-input' : 'login-input'}
            placeholder={field.placeholder}
            required={field.required}
            style={{ width: '100%' }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">{title}</h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Render fields that are grouped in rows */}
          {Object.entries(rowGroups).map(([rowKey, rowFields]) => {
            if (rowKey === 'ungrouped') {
              // Render ungrouped fields normally
              return rowFields.map((field) => renderField(field));
            } else {
              // Render fields in a row
              return (
                <div
                  key={rowKey}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: rowFields.length === 2 ? '1fr 1fr' : '1fr',
                    gap: '1.25rem',
                    width: '100%',
                    maxWidth: '100%',
                  }}
                >
                  {rowFields.map((field) => renderField(field))}
                </div>
              );
            }
          })}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? `${submitLabel}...` : submitLabel}
          </button>
        </form>

        {(footerText || footerLinkText) && (
          <div className="login-footer">
            <p>
              {footerText}{' '}
              <Link href={footerLinkHref} className="login-link">
                {footerLinkText}
              </Link>
            </p>
          </div>
        )}

        {additionalFooter}
      </div>
    </div>
  );
}
