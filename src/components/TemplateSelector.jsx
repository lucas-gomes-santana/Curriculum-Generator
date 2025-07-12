import React from 'react';
import '../styles/TemplateSelector.css';

function TemplateSelector({ 
    selectedTemplate, 
    setSelectedTemplate, 
    backgroundColor, 
    setBackgroundColor 
}) {
    return (
        <div className="template-selection">
            <h2>Selecione um Modelo de Currículo</h2>
            <div className="template-options">
                <div className={`template-option ${selectedTemplate === 'template1' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        id="template1"
                        name="template"
                        value="template1"
                        checked={selectedTemplate === 'template1'}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                    />
                    <label htmlFor="template1">
                        <div className="template-preview template1-preview">
                            <h3>Modelo Clássico</h3>
                            <p>Layout tradicional e profissional</p>
                            <span className="template-benefits">✓ Gratuito</span>
                            <span className="template-disvantages">Sem foto</span>
                        </div>
                    </label>
                </div>
                
                <div className={`template-option ${selectedTemplate === 'template2' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        id="template2"
                        name="template"
                        value="template2"
                        checked={selectedTemplate === 'template2'}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                    />
                    <label htmlFor="template2">
                        <div className="template-preview template2-preview">
                            <h3>Template Moderno</h3>
                            <p>Layout com foto e cores personalizáveis</p>
                            <span className="template-features">✓ Com foto</span>
                            <span className="template-features">✓ Cores personalizáveis</span>
                        </div>
                    </label>
                </div>
            </div>
            
            {selectedTemplate === 'template2' && (
                <div className="color-selection">
                    <h3>Escolha a cor de fundo:</h3>
                    <div className="color-options">
                        <label className={`color-option ${backgroundColor === 'azul' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="backgroundColor"
                                value="azul"
                                checked={backgroundColor === 'azul'}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                            />
                            <span className="color-preview azul"></span>
                            <span>Azul</span>
                        </label>
                        <label className={`color-option ${backgroundColor === 'verde' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="backgroundColor"
                                value="verde"
                                checked={backgroundColor === 'verde'}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                            />
                            <span className="color-preview verde"></span>
                            <span>Verde</span>
                        </label>
                        <label className={`color-option ${backgroundColor === 'vermelho' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="backgroundColor"
                                value="vermelho"
                                checked={backgroundColor === 'vermelho'}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                            />
                            <span className="color-preview vermelho"></span>
                            <span>Vermelho</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TemplateSelector; 