import React, { useState, useEffect } from 'react';
import '../styles/DateSelector.css';

function DateSelector({ 
    name, 
    value, 
    onChange, 
    disabled, 
    required, 
    label,
    onValidationError
}) {
    // Array com todos os meses
    const meses = [
        { valor: '01', nome: 'Janeiro' },
        { valor: '02', nome: 'Fevereiro' },
        { valor: '03', nome: 'Março' },
        { valor: '04', nome: 'Abril' },
        { valor: '05', nome: 'Maio' },
        { valor: '06', nome: 'Junho' },
        { valor: '07', nome: 'Julho' },
        { valor: '08', nome: 'Agosto' },
        { valor: '09', nome: 'Setembro' },
        { valor: '10', nome: 'Outubro' },
        { valor: '11', nome: 'Novembro' },
        { valor: '12', nome: 'Dezembro' }
    ];

    const parseValue = (value) => {
        if (!value) return { mes: '', ano: '' };
        const [ano, mes] = value.split('-');
        return { mes: mes || '', ano: ano || '' };
    };

    const formatValue = (mes, ano) => {
        if (!mes || !ano) return '';
        return `${ano}-${mes}`;
    };

    const [localValue, setLocalValue] = useState(parseValue(value));
    const [yearError, setYearError] = useState('');

    // Atualizar estado local quando o valor externo mudar
    useEffect(() => {
        setLocalValue(parseValue(value));
    }, [value]);

    // Validar ano (deve ter 4 dígitos)
    const validateYear = (ano) => {
        if (!ano) return '';
        if (ano.length !== 4) {
            return 'O ano deve ter 4 dígitos';
        }
        if (!/^\d{4}$/.test(ano)) {
            return 'O ano deve conter apenas números';
        }
        const yearNum = parseInt(ano);
        const currentYear = new Date().getFullYear();
        if (yearNum < 1900 || yearNum > currentYear + 10) {
            return `O ano deve estar entre 1900 e ${currentYear + 10}`;
        }
        return '';
    };

    const handleMesChange = (e) => {
        const novoMes = e.target.value;
        const novoValor = formatValue(novoMes, localValue.ano);
        setLocalValue(prev => ({ ...prev, mes: novoMes }));
        
        // Limpar erro de validação quando o mês mudar
        if (yearError) {
            setYearError('');
            if (onValidationError) {
                onValidationError(name, '');
            }
        }
        
        onChange({
            target: {
                name: name,
                value: novoValor
            }
        });
    };

    const handleAnoChange = (e) => {
        const novoAno = e.target.value;
        const error = validateYear(novoAno);
        setYearError(error);
        
        // Sempre notificar sobre mudanças de erro (incluindo quando limpa)
        if (onValidationError) {
            onValidationError(name, error);
        }
        
        const novoValor = formatValue(localValue.mes, novoAno);
        setLocalValue(prev => ({ ...prev, ano: novoAno }));
        onChange({
            target: {
                name: name,
                value: novoValor
            }
        });
    };

    return (
        <label className="date-selector">
            {label}:
            <div className="date-inputs">
                <select
                    value={localValue.mes}
                    onChange={handleMesChange}
                    disabled={disabled}
                    required={required}
                    className="month-select"
                >
                    <option value="">Mês</option>
                    {meses.map((mes) => (
                        <option key={mes.valor} value={mes.valor}>
                            {mes.nome}
                        </option>
                    ))}
                </select>
                
                <input
                    type="text"
                    value={localValue.ano}
                    onChange={handleAnoChange}
                    disabled={disabled}
                    required={required}
                    className={`year-input ${yearError ? 'error' : ''}`}
                    placeholder="Ano"
                    maxLength="4"
                />
            </div>
            {yearError && <div className="error-message">{yearError}</div>}
        </label>
    );
}

export default DateSelector; 