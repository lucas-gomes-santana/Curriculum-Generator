import { useState, useRef } from "react";
import jsPDF from "jspdf";
import { auth } from "../services/firebase";
import { salvarCurriculo } from "../services/storage";
import "../styles/CriarCurriculo.css";

function Home() {
    const [isFormEnabled, setIsFormEnabled] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        cidade: "",
        estado: "",
        cep: "",
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

    const generatePDF = () => {
        const doc = new jsPDF();
        let y = 15;
        const marginLeft = 15;
        const lineHeight = 6;
        const sectionSpacing = 7;

        // Foto (se houver)
        if (foto) {
            // Tamanho e posição da foto
            const imgSize = 40;
            const xCenter = (210 - imgSize) / 2; // Centralizar horizontalmente
            // Desenhar círculo branco para "máscara"
            doc.setFillColor(255,255,255);
            doc.circle(105, y + imgSize/2, imgSize/2 + 2, 'F');
            // Adicionar imagem
            doc.addImage(foto, 'JPEG', xCenter, y, imgSize, imgSize, undefined, 'FAST');
            y += imgSize + 10; // Mais espaço após a foto
        }

        // Nome
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(form.nome, 105, y, { align: "center" });
        y += 15;
        // Linha divisória
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, 200 - marginLeft, y);
        y += sectionSpacing;

        // Contato
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Contato:", marginLeft, y);
        doc.setFont("helvetica", "normal");
        doc.text(`Email: ${form.email} | Telefone: ${form.telefone}`, marginLeft + 25, y);
        y += lineHeight;
        // Endereço
        doc.setFont("helvetica", "bold");
        doc.text("Endereço:", marginLeft, y);
        doc.setFont("helvetica", "normal");
        const endereco = `${form.rua}, ${form.numero} - ${form.cidade} - ${form.estado} - CEP: ${form.cep}`;
        doc.text(endereco, marginLeft + 25, y);
        y += sectionSpacing;
        // Linha divisória
        doc.line(marginLeft, y, 200 - marginLeft, y);
        y += sectionSpacing;

        // Resumo
        doc.setFont("helvetica", "bold");
        doc.text("Resumo Profissional:", marginLeft, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        const resumoLines = doc.splitTextToSize(form.resumo, 180);
        doc.text(resumoLines, marginLeft, y);
        y += (resumoLines.length * lineHeight); 
        // Linha divisória
        doc.line(marginLeft, y, 200 - marginLeft, y);
        y += sectionSpacing;

        // Habilidades
        const tecnicas = form.habilidadesTecnicas.split(',').map(s => s.trim()).filter(s => s);
        const pessoais = form.habilidadesPessoais.split(',').map(s => s.trim()).filter(s => s);

        if (tecnicas.length > 0 || pessoais.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.text("Habilidades", marginLeft, y);
            y += lineHeight;
            
            if (tecnicas.length > 0) {
                doc.setFont("helvetica", "bold");
                doc.text("Técnicas:", marginLeft, y);
                doc.setFont("helvetica", "normal");
                const skillsLines = doc.splitTextToSize(tecnicas.join(' • '), 170);
                doc.text(skillsLines, marginLeft + 25, y);
                y += (skillsLines.length * lineHeight);
            }

            if (pessoais.length > 0) {
                doc.setFont("helvetica", "bold");
                doc.text("Pessoais:", marginLeft, y);
                doc.setFont("helvetica", "normal");
                const skillsLines = doc.splitTextToSize(pessoais.join(' • '), 170);
                doc.text(skillsLines, marginLeft + 25, y);
                y += (skillsLines.length * lineHeight);
            }
            
            y += 5;
            // Linha divisória
            doc.line(marginLeft, y, 200 - marginLeft, y);
            y += sectionSpacing;
        }

        // Formação Acadêmica
        doc.setFont("helvetica", "bold");
        doc.text("Formação Acadêmica:", marginLeft, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        const formacaoText = [
            `Curso: ${form.formacaoCurso}`,
            `Instituição de Ensino: ${form.formacaoInstituicao}`,
            `${form.formacaoInicio} - ${form.formacaoTermino}`,
        ];
        formacaoText.forEach(line => {
            if (line.trim()) {
                const wrappedLines = doc.splitTextToSize(line, 180);
                doc.text(wrappedLines, marginLeft, y);
                y += (wrappedLines.length * lineHeight);
            }
        });
        y += 5;
        // Linha divisória
        doc.line(marginLeft, y, 200 - marginLeft, y);
        y += sectionSpacing;

        // Experiência Profissional (só se não marcar semExperiencia)
        if (!form.semExperiencia) {
            doc.setFont("helvetica", "bold");
            doc.text("Experiência Profissional:", marginLeft, y);
            y += lineHeight;
            doc.setFont("helvetica", "normal");
            const expTermino = form.expAtual ? "Atualmente" : form.expTermino;
            const experienciaText = [
                `Cargo: ${form.expCargo}`,
                `Empresa: ${form.expEmpresa}`,
                `${form.expInicio} - ${expTermino}`,
                `${form.expDescricao}`
            ];
            experienciaText.forEach(line => {
                if (line.trim()) {
                    const wrappedLines = doc.splitTextToSize(line, 180);
                    doc.text(wrappedLines, marginLeft, y);
                    y += (wrappedLines.length * lineHeight);
                }
            });
        }

        return doc;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const doc = generatePDF();
            
            // Download automático
            doc.save("curriculo-ATS.pdf");
            
            // Mostrar opções de salvar se usuário estiver logado
            if (auth.currentUser) {
                setShowSaveOptions(true);
            }
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar o PDF. Tente novamente.");
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
            
            // Preparar dados do currículo incluindo a foto
            const dadosCurriculo = {
                ...form,
                foto: foto // incluir a foto base64
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
                    CEP:
                    <input name="cep" value={form.cep} onChange={handleChange} disabled={!isFormEnabled} required />
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

export default Home;