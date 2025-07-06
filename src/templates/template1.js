import jsPDF from "jspdf";

/**
 * Gera um PDF de currículo a partir dos dados fornecidos
 * @param {Object} dadosCurriculo - Objeto contendo todos os dados do currículo
 * @returns {jsPDF} Documento PDF gerado
 */
export const gerarPDFCurriculo = (dadosCurriculo) => {
    const doc = new jsPDF();
    
    // ===== CONFIGURAÇÕES DE LAYOUT =====
    const layoutConfig = {
        // Margens e espaçamentos
        marginLeft: 15,
        marginRight: 15,
        pageWidth: 210,
        
        // Alturas e espaçamentos
        lineHeight: 6,
        sectionSpacing: 7,
        titleSpacing: 15,
        smallSpacing: 5,
        
        // Posições iniciais
        startY: 15,
        
        // Tamanhos de fonte
        titleFontSize: 22,
        sectionTitleFontSize: 12,
        normalFontSize: 10
    };
    
    // ===== VARIÁVEIS DE POSIÇÃO =====
    let currentY = layoutConfig.startY;



    // ===== SEÇÃO: NOME =====
    doc.setFontSize(layoutConfig.titleFontSize);
    doc.setFont("helvetica", "bold");
    doc.text(dadosCurriculo.nome, 105, currentY, { align: "center" });
    currentY += layoutConfig.titleSpacing;
    
    currentY += layoutConfig.sectionSpacing;

    // ===== SEÇÃO: CONTATO =====
    doc.setFontSize(layoutConfig.sectionTitleFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("Contato:", layoutConfig.marginLeft, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${dadosCurriculo.email} | Telefone: ${dadosCurriculo.telefone}`, layoutConfig.marginLeft + 25, currentY);
    currentY += layoutConfig.lineHeight;
    
    // ===== SEÇÃO: ENDEREÇO =====
    doc.setFont("helvetica", "bold");
    doc.text("Endereço:", layoutConfig.marginLeft, currentY);
    doc.setFont("helvetica", "normal");
    const endereco = `${dadosCurriculo.rua}, ${dadosCurriculo.numero} - ${dadosCurriculo.cidade} - ${dadosCurriculo.estado}`;
    doc.text(endereco, layoutConfig.marginLeft + 25, currentY);
    currentY += layoutConfig.sectionSpacing;

    // ===== SEÇÃO: RESUMO =====
    doc.setFont("helvetica", "bold");
    doc.text("Resumo Profissional:", layoutConfig.marginLeft, currentY);
    currentY += layoutConfig.lineHeight;
    doc.setFont("helvetica", "normal");
    const resumoLines = doc.splitTextToSize(dadosCurriculo.resumo, layoutConfig.pageWidth - layoutConfig.marginLeft - layoutConfig.marginRight);
    doc.text(resumoLines, layoutConfig.marginLeft, currentY);
    currentY += (resumoLines.length * layoutConfig.lineHeight) + layoutConfig.sectionSpacing;

    // ===== SEÇÃO: HABILIDADES =====
    const tecnicas = dadosCurriculo.habilidadesTecnicas ? 
        dadosCurriculo.habilidadesTecnicas.split(',').map(s => s.trim()).filter(s => s) : [];
    const pessoais = dadosCurriculo.habilidadesPessoais ? 
        dadosCurriculo.habilidadesPessoais.split(',').map(s => s.trim()).filter(s => s) : [];

    if (tecnicas.length > 0 || pessoais.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Habilidades", layoutConfig.marginLeft, currentY);
        currentY += layoutConfig.lineHeight;

        if (tecnicas.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.text("Técnicas:", layoutConfig.marginLeft, currentY);
            doc.setFont("helvetica", "normal");
            const skillsLines = doc.splitTextToSize(tecnicas.join(' • '), layoutConfig.pageWidth - layoutConfig.marginLeft - layoutConfig.marginRight - 10);
            doc.text(skillsLines, layoutConfig.marginLeft + 25, currentY);
            currentY += (skillsLines.length * layoutConfig.lineHeight);
        }

        if (pessoais.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.text("Pessoais:", layoutConfig.marginLeft, currentY);
            doc.setFont("helvetica", "normal");
            const skillsLines = doc.splitTextToSize(pessoais.join(' • '), layoutConfig.pageWidth - layoutConfig.marginLeft - layoutConfig.marginRight - 10);
            doc.text(skillsLines, layoutConfig.marginLeft + 25, currentY);
            currentY += (skillsLines.length * layoutConfig.lineHeight);
        }

        currentY += layoutConfig.sectionSpacing;
    }

    // ===== SEÇÃO: FORMAÇÃO ACADÊMICA =====
    doc.setFont("helvetica", "bold");
    doc.text("Formação Acadêmica:", layoutConfig.marginLeft, currentY);
    currentY += layoutConfig.lineHeight;
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
            const wrappedLines = doc.splitTextToSize(line, layoutConfig.pageWidth - layoutConfig.marginLeft - layoutConfig.marginRight);
            doc.text(wrappedLines, layoutConfig.marginLeft, currentY);
            currentY += (wrappedLines.length * layoutConfig.lineHeight);
        }
    });
    currentY += layoutConfig.sectionSpacing;

    // ===== SEÇÃO: EXPERIÊNCIA PROFISSIONAL =====
    if (!dadosCurriculo.semExperiencia) {
        doc.setFont("helvetica", "bold");
        doc.text("Experiência Profissional:", layoutConfig.marginLeft, currentY);
        currentY += layoutConfig.lineHeight;
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
                const wrappedLines = doc.splitTextToSize(line, layoutConfig.pageWidth - layoutConfig.marginLeft - layoutConfig.marginRight);
                doc.text(wrappedLines, layoutConfig.marginLeft, currentY);
                currentY += (wrappedLines.length * layoutConfig.lineHeight);
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