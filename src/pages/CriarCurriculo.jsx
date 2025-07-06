import { useState, useRef } from "react";
import { auth } from "../services/firebase";
import { salvarCurriculo } from "../services/storage";
import { downloadPDFCurriculo as downloadTemplate1 } from "../templates/template1";
import { downloadPDFCurriculo as downloadTemplate2 } from "../templates/template2";
import "../styles/CriarCurriculo.css";

function CriarCurriculo() {
    const [isFormEnabled, setIsFormEnabled] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('template1');
    const [backgroundColor, setBackgroundColor] = useState('azul');
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        cidade: "",
        estado: "",
        rua: "",
        numero: "",
        resumo: "",
        formacaoInstituicao: "",
        formacaoCurso: "",
        formacaoInicio: "",
        formacaoTermino: "",
        expEmpresa: "",
        expCargo: "",
        expInicio: "",
        expTermino: "",
        expAtual: false,
        expDescricao: "",
        semExperiencia: false,
        habilidadesTecnicas: "",
        habilidadesPessoais: ""
    });
    const [foto, setFoto] = useState(null); // base64
    const [fotoPreview, setFotoPreview] = useState(null); // url para preview
    const [showSaveOptions, setShowSaveOptions] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const fileInputRef = useRef();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFoto(ev.target.result); // base64
                setFotoPreview(ev.target.result); // para preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Preparar dados do currículo
            const dadosCurriculo = {
                ...form,
                foto: selectedTemplate === 'template2' ? foto : null // só incluir foto no template2
            };
            
            // Gerar e fazer download do PDF baseado no template selecionado
            if (selectedTemplate === 'template1') {
                downloadTemplate1(dadosCurriculo, "curriculo.pdf");
            } else if (selectedTemplate === 'template2') {
                await downloadTemplate2(dadosCurriculo, "curriculo.pdf", backgroundColor);
            }
            
            // Mostrar opções de salvar se usuário estiver logado
            if (auth.currentUser) {
                setShowSaveOptions(true);
            }

        } 
        catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro criar o currículo. Tente novamente.");
        }
    };

    const handleSaveToCloud = async () => {
        if (!auth.currentUser) {
            alert("Você precisa estar logado para salvar o currículo.");
            return;
        }

        try {
            setSaving(true);
            setSaveMessage("Salvando currículo...");
            
            // Preparar dados do currículo incluindo a foto e informações do template
            const dadosCurriculo = {
                ...form,
                foto: selectedTemplate === 'template2' ? foto : null, // só incluir foto no template2
                template: selectedTemplate,
                backgroundColor: selectedTemplate === 'template2' ? backgroundColor : null
            };
            
            await salvarCurriculo(dadosCurriculo, auth.currentUser.uid);
            
            setSaveMessage("Currículo salvo com sucesso! ✅");
            setTimeout(() => {
                setShowSaveOptions(false);
                setSaveMessage("");
            }, 2000);
            
        } catch (error) {
            console.error("Erro ao salvar currículo:", error);
            setSaveMessage("Erro ao salvar currículo. Tente novamente. ❌");
            
        } finally {
            setSaving(false);
        }
    };

    const handleSkipSave = () => {
        setShowSaveOptions(false);
        setSaveMessage("");
    };

    return (
        <div className="home-container">
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
                                <h3>Template Clássico</h3>
                                <p>Layout tradicional e profissional</p>
                                <span className="template-features">✓ Sem foto</span>
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
            
            <button 
                onClick={() => setIsFormEnabled(!isFormEnabled)}
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
            >
                {isFormEnabled ? "Desabilitar Formulário" : "Criar novo currículo"}
            </button>
            
            <form 
                className="curriculo-form" 
                onSubmit={handleSubmit}
                style={{
                    opacity: isFormEnabled ? 1 : 0.5,
                    pointerEvents: isFormEnabled ? "auto" : "none",
                    filter: isFormEnabled ? "none" : "grayscale(100%)",
                    transition: "all 0.3s ease"
                }}
            >
                {selectedTemplate === 'template2' && (
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        Foto (opcional):
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            disabled={!isFormEnabled}
                            ref={fileInputRef}
                            style={{ margin: "10px 0" }}
                        />
                        {fotoPreview && (
                            <img
                                src={fotoPreview}
                                alt="Preview"
                                style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "3px solid #667eea",
                                    marginBottom: 10
                                }}
                            />
                        )}
                    </label>
                )}
                <label>
                    Nome:
                    <input name="nome" value={form.nome} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <label>
                    Email:
                    <input name="email" type="email" value={form.email} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <label>
                    Telefone:
                    <input name="telefone" value={form.telefone} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <label>
                    Rua:
                    <input name="rua" value={form.rua} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <label>
                    Número:
                    <input name="numero" value={form.numero} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <label>
                    Cidade:
                    <input name="cidade" value={form.cidade} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <label>
                    Estado:
                    <input name="estado" value={form.estado} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <label>
                    Resumo:
                    <textarea name="resumo" value={form.resumo} onChange={handleChange} disabled={!isFormEnabled} required />
                </label>
                <fieldset>
                    <legend>Habilidades</legend>
                    <label>
                        Habilidades Técnicas (separadas por vírgula):
                        <textarea name="habilidadesTecnicas" value={form.habilidadesTecnicas} onChange={handleChange} disabled={!isFormEnabled} placeholder="Ex: React, Node.js, Gestão de Projetos" />
                    </label>
                    <label>
                        Habilidades Pessoais (separadas por vírgula):
                        <textarea name="habilidadesPessoais" value={form.habilidadesPessoais} onChange={handleChange} disabled={!isFormEnabled} placeholder="Ex: Comunicação, Liderança, Trabalho em equipe" />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Formação Acadêmica</legend>
                    <label>
                        Instituição:
                        <input name="formacaoInstituicao" value={form.formacaoInstituicao} onChange={handleChange} disabled={!isFormEnabled} required />
                    </label>
                    <label>
                        Curso:
                        <input name="formacaoCurso" value={form.formacaoCurso} onChange={handleChange} disabled={!isFormEnabled} required />
                    </label>
                    <label>
                        Data de início:
                        <input name="formacaoInicio" type="month" value={form.formacaoInicio} onChange={handleChange} disabled={!isFormEnabled} required />
                    </label>
                    <label>
                        Data de término:
                        <input name="formacaoTermino" type="month" value={form.formacaoTermino} onChange={handleChange} disabled={!isFormEnabled} required />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Experiência Profissional</legend>
                    <label>
                        <input type="checkbox" name="semExperiencia" checked={form.semExperiencia} onChange={handleChange} disabled={!isFormEnabled} /> Ainda não possuo experiência profissional
                    </label>
                    {!form.semExperiencia && (
                        <>
                            <label>
                                Empresa:
                                <input name="expEmpresa" value={form.expEmpresa} onChange={handleChange} disabled={!isFormEnabled} required={!form.semExperiencia} />
                            </label>
                            <label>
                                Cargo:
                                <input name="expCargo" value={form.expCargo} onChange={handleChange} disabled={!isFormEnabled} required={!form.semExperiencia} />
                            </label>
                            <label>
                                Data de início:
                                <input name="expInicio" type="month" value={form.expInicio} onChange={handleChange} disabled={!isFormEnabled} required={!form.semExperiencia} />
                            </label>
                            <label>
                                Data de término:
                                <input name="expTermino" type="month" value={form.expTermino} onChange={handleChange} disabled={!isFormEnabled || form.expAtual} required={!form.expAtual && !form.semExperiencia} />
                            </label>
                            <label>
                                <input type="checkbox" name="expAtual" checked={form.expAtual} onChange={handleChange} disabled={!isFormEnabled} /> Atualmente trabalho aqui
                            </label>
                            <label>
                                Descrição das atividades:
                                <textarea name="expDescricao" value={form.expDescricao} onChange={handleChange} disabled={!isFormEnabled} />
                            </label>
                        </>
                    )}
                </fieldset>
                <button type="submit" disabled={!isFormEnabled}>Gerar Currículo PDF</button>
            </form>

            {/* Modal de opções de salvar */}
            {showSaveOptions && (
                <div className="save-modal-overlay">
                    <div className="save-modal">
                        <h3>Currículo gerado com sucesso! 📄</h3>
                        <p>Deseja salvar este currículo na nuvem para acessá-lo depois?</p>
                        
                        {saveMessage && (
                            <div className={`save-message ${saveMessage.includes('sucesso') ? 'success' : 'error'}`}>
                                {saveMessage}
                            </div>
                        )}
                        
                        <div className="save-actions">
                            <button 
                                onClick={handleSaveToCloud} 
                                disabled={saving}
                                className="btn-save"
                            >
                                {saving ? "Salvando..." : "💾 Salvar na nuvem"}
                            </button>
                            <button 
                                onClick={handleSkipSave}
                                className="btn-skip"
                                disabled={saving}
                            >
                                Pular
                            </button>
                        </div>
                        
                        <div className="save-benefits">
                            <h4>Benefícios de salvar:</h4>
                            <ul>
                                <li>✅ Acesse seus currículos de qualquer lugar</li>
                                <li>✅ Faça download novamente quando quiser</li>
                                <li>✅ Organize múltiplos currículos</li>
                                <li>✅ Não perca seus dados</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CriarCurriculo;