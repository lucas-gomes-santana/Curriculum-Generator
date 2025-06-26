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
        expDescricao: ""
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
        let y = 15;
        doc.setFontSize(22);
        doc.text(form.nome, 105, y, { align: "center" });
        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Contato:", 10, y);
        doc.setFont("times", "normal");
        doc.text(`Email: ${form.email}  |  Telefone: ${form.telefone}`, 35, y);
        y += 7;
        doc.setFont("helvetica", "bold");
        doc.text("Endereço:", 10, y);
        doc.setFont("times", "normal");
        doc.text(
            `${form.rua}, ${form.numero}${form.complemento ? ", " + form.complemento : ""} - ${form.cidade} - ${form.estado} - CEP: ${form.cep}`,
            35,
            y
        );
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Resumo:", 10, y);
        y += 7;
        doc.setFont("times", "normal");
        doc.text(form.resumo, 10, y, { maxWidth: 190 });
        y += 15;
        doc.setFont("helvetica", "bold");
        doc.text("Formação Acadêmica:", 10, y);
        y += 7;
        doc.setFont("times", "normal");
        doc.text(
            `${form.formacaoCurso} - ${form.formacaoInstituicao}\n${form.formacaoInicio} até ${form.formacaoTermino}\n${form.formacaoDescricao}`,
            10,
            y,
            { maxWidth: 190 }
        );
        y += 20;
        doc.setFont("helvetica", "bold");
        doc.text("Experiência Profissional:", 10, y);
        y += 7;
        doc.setFont("times", "normal");
        doc.text(
            `${form.expCargo} - ${form.expEmpresa}\n${form.expInicio} até ${form.expAtual ? "Atualmente" : form.expTermino}\n${form.expDescricao}`,
            10,
            y,
            { maxWidth: 190 }
        );
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
                        Empresa:
                        <input name="expEmpresa" value={form.expEmpresa} onChange={handleChange} disabled={!isFormEnabled} required />
                    </label>
                    <label>
                        Cargo:
                        <input name="expCargo" value={form.expCargo} onChange={handleChange} disabled={!isFormEnabled} required />
                    </label>
                    <label>
                        Data de início:
                        <input name="expInicio" type="month" value={form.expInicio} onChange={handleChange} disabled={!isFormEnabled} required />
                    </label>
                    <label>
                        Data de término:
                        <input name="expTermino" type="month" value={form.expTermino} onChange={handleChange} disabled={!isFormEnabled || form.expAtual} required={!form.expAtual} />
                    </label>
                    <label>
                        <input type="checkbox" name="expAtual" checked={form.expAtual} onChange={handleChange} disabled={!isFormEnabled} /> Atualmente trabalho aqui
                    </label>
                    <label>
                        Descrição das atividades:
                        <textarea name="expDescricao" value={form.expDescricao} onChange={handleChange} disabled={!isFormEnabled} />
                    </label>
                </fieldset>
                <button type="submit" disabled={!isFormEnabled}>Gerar Currículo PDF</button>
            </form>
        </div>
    );
}

export default Home;