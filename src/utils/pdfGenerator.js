import jsPDF from "jspdf";

/**
 * Gera um PDF de currículo a partir dos dados fornecidos
 * @param {Object} dadosCurriculo - Objeto contendo todos os dados do currículo
 * @returns {jsPDF} Documento PDF gerado
 */
export const gerarPDFCurriculo = (dadosCurriculo) => {
    const doc = new jsPDF();
    let y = 15;
    const marginLeft = 15;
    const lineHeight = 6;
    const sectionSpacing = 7;

    // Foto (se houver)
    if (dadosCurriculo.foto) {
        const imgSize = 40;
        const xCenter = (210 - imgSize) / 2; // Centralizar horizontalmente
        // Desenhar círculo branco para "máscara"
        doc.setFillColor(255, 255, 255);
        doc.circle(105, y + imgSize / 2, imgSize / 2 + 2, 'F');
        // Adicionar imagem
        doc.addImage(dadosCurriculo.foto, 'JPEG', xCenter, y, imgSize, imgSize, undefined, 'FAST');
        y += imgSize + 10; // Mais espaço após a foto
    }

    // Nome
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(dadosCurriculo.nome, 105, y, { align: "center" });
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
    doc.text(`Email: ${dadosCurriculo.email} | Telefone: ${dadosCurriculo.telefone}`, marginLeft + 25, y);
    y += lineHeight;
    
    // Endereço
    doc.setFont("helvetica", "bold");
    doc.text("Endereço:", marginLeft, y);
    doc.setFont("helvetica", "normal");
    const endereco = `${dadosCurriculo.rua}, ${dadosCurriculo.numero} - ${dadosCurriculo.cidade} - ${dadosCurriculo.estado}`;
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
    const resumoLines = doc.splitTextToSize(dadosCurriculo.resumo, 180);
    doc.text(resumoLines, marginLeft, y);
    y += (resumoLines.length * lineHeight);
    // Linha divisória
    doc.line(marginLeft, y, 200 - marginLeft, y);
    y += sectionSpacing;

    // Habilidades
    const tecnicas = dadosCurriculo.habilidadesTecnicas ? 
        dadosCurriculo.habilidadesTecnicas.split(',').map(s => s.trim()).filter(s => s) : [];
    const pessoais = dadosCurriculo.habilidadesPessoais ? 
        dadosCurriculo.habilidadesPessoais.split(',').map(s => s.trim()).filter(s => s) : [];

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
        `Curso: ${dadosCurriculo.formacaoCurso}`,
        `Instituição de Ensino: ${dadosCurriculo.formacaoInstituicao}`,
        `${dadosCurriculo.formacaoInicio} - ${dadosCurriculo.formacaoTermino}`,
    ];
    
    // Adicionar descrição da formação se existir
    if (dadosCurriculo.formacaoDescricao) {
        formacaoText.push(dadosCurriculo.formacaoDescricao);
    }
    
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

    // Experiência Profissional 
    if (!dadosCurriculo.semExperiencia) {
        doc.setFont("helvetica", "bold");
        doc.text("Experiência Profissional:", marginLeft, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");
        const expTermino = dadosCurriculo.expAtual ? "Atualmente" : dadosCurriculo.expTermino;
        const experienciaText = [
            `Cargo: ${dadosCurriculo.expCargo}`,
            `Empresa: ${dadosCurriculo.expEmpresa}`,
            `${dadosCurriculo.expInicio} - ${expTermino}`,
            `${dadosCurriculo.expDescricao}`
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

/**
 * Faz o download do PDF gerado
 * @param {Object} dadosCurriculo - Dados do currículo
 * @param {string} nomeArquivo - Nome do arquivo (opcional)
 */
export const downloadPDFCurriculo = (dadosCurriculo, nomeArquivo = null) => {
    try {
        const doc = gerarPDFCurriculo(dadosCurriculo);
        const fileName = nomeArquivo || `curriculo_${dadosCurriculo.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        
        // Download do PDF
        doc.save(fileName);
    } catch (error) {
        console.error('Erro ao fazer download do PDF:', error);
        throw error;
    }
}; 