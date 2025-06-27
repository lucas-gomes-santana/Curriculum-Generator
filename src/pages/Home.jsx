import { useState } from "react";
import jsPDF from "jspdf";
import "../styles/Home.css";

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
        complemento: "",
        resumo: "",
        formacaoInstituicao: "",
        formacaoCurso: "",
        formacaoInicio: "",
        formacaoTermino: "",
        formacaoDescricao: "",
        expEmpresa: "",
        expCargo: "",
        expInicio: "",
        expTermino: "",
        expAtual: false,
        expDescricao: "",
        semExperiencia: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const doc = new jsPDF();
        let y = 20; // Posição vertical inicial
        const marginLeft = 15;
        const lineHeight = 7;
        const sectionSpacing = 10;

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
        const endereco = `${form.rua}, ${form.numero}${form.complemento ? ", " + form.complemento : ""} - ${form.cidade} - ${form.estado} - CEP: ${form.cep}`;
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
        y += (resumoLines.length * lineHeight) + 5; // Espaço menor após resumo
        // Linha divisória
        doc.line(marginLeft, y, 200 - marginLeft, y);
        y += sectionSpacing;

        // Formação Acadêmica
        doc.setFont("helvetica", "bold");
        doc.text("Formação Acadêmica:", marginLeft, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        const formacaoText = [
            `Curso: ${form.formacaoCurso}`,
            `Instituição de Ensino: ${form.formacaoInstituicao}`,
            `${form.formacaoInicio} - ${form.formacaoTermino}`,
            `${form.formacaoDescricao}`
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
        doc.save("curriculo-ATS.pdf");
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
                    Complemento:
                    <input name="complemento" value={form.complemento} onChange={handleChange} disabled={!isFormEnabled} />
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
                    <label>
                        Descrição:
                        <textarea name="formacaoDescricao" value={form.formacaoDescricao} onChange={handleChange} disabled={!isFormEnabled} />
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
        </div>
    );
}

export default Home;