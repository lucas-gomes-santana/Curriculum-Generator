import { useState, useEffect } from 'react';
import '../styles/PhoneSelector.css';

const PhoneSelector = ({ value, onChange, disabled, required, label = "Telefone" }) => {
    const [displayValue, setDisplayValue] = useState('');
    const [error, setError] = useState('');



    // Format phone number progressively as user types
    const formatPhoneNumber = (input) => {
        // Remove all non-digit characters
        let value = input.replace(/\D/g, '');
        
        // If empty, return empty
        if (value.length === 0) return '';
        
        // If starts with 0, remove it (invalid area code)
        if (value.startsWith('0')) {
            value = value.substring(1);
        }
        
        // Progressive formatting based on length
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } 
            else if (value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } 
            else if (value.length <= 10) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } 
            else if (value.length <= 11) {
                // For mobile numbers (11 digits total)
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } 
            else {
                // Limit to 11 digits for mobile
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }
        
        return value;
    };

    // Validate phone number
    const validatePhoneNumber = (phone) => {
        if (!phone) {
            return required ? 'Telefone é obrigatório' : '';
        }
        
        // Remove formatting for validation
        const digits = phone.replace(/\D/g, '');
        
        // Don't show validation errors while user is still typing
        if (digits.length < 10) {
            return '';
        }
        
        // Check if starts with 0 (invalid area code)
        if (digits.startsWith('0')) {
            return 'Código de área não pode começar com 0';
        }
        
        // Check length (10 for landline, 11 for mobile)
        if (digits.length > 11) {
            return 'Telefone deve ter no máximo 11 dígitos';
        }
        
        // Check area code (must be between 11 and 99)
        const areaCode = parseInt(digits.substring(0, 2));
        if (areaCode < 11 || areaCode > 99) {
            return 'Código de área inválido';
        }
        
        // Only validate complete numbers
        if (digits.length === 10) {
            // Landline number validation
            const number = digits.substring(2);
            if (!/^[2-9]\d{7}$/.test(number)) {
                return 'Número de telefone fixo inválido';
            }
        } else if (digits.length === 11) {
            // Mobile number validation
            const number = digits.substring(2);
            if (!/^9\d{8}$/.test(number)) {
                return 'Número de celular deve começar com 9';
            }
        }
        
        return ''; // Valid
    };

    // Handle input change
    const handleInputChange = (e) => {
        const input = e.target.value;
        
        // Format the input
        const formatted = formatPhoneNumber(input);
        setDisplayValue(formatted);
        
        // Validate
        const validationError = validatePhoneNumber(formatted);
        setError(validationError);
        
        // Call parent onChange with the formatted value
        onChange({
            target: {
                name: 'telefone',
                value: formatted
            }
        });
    };

    // Update display value when prop changes
    useEffect(() => {
        setDisplayValue(value || '');
    }, [value]);

    return (
        <div className="phone-selector">
            <label className="phone-label">
                {label}:
                <input
                    type="tel"
                    name="telefone"
                    value={displayValue}
                    onChange={handleInputChange}
                    disabled={disabled}
                    required={required}
                    placeholder="(11) 99999-9999"
                    className={`phone-input ${error ? 'error' : ''}`}
                />
            </label>
            {error && (
                <div className="phone-error">
                    {error}
                </div>
            )}
            <div className="phone-help">
                <small>
                    Formato: (XX) XXXXX-XXXX (celular) ou (XX) XXXX-XXXX (fixo)
                </small>
            </div>
        </div>
    );
};

export default PhoneSelector; 