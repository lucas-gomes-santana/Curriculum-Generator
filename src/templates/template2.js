import jsPDF from "jspdf";

/**
 * Recorta uma imagem para formato circular com fundo transparente e alta resolução
 * @param {string} imageData - Base64 da imagem
 * @param {number} size - Tamanho da imagem final
 * @returns {Promise<string>} Base64 da imagem circular
 */
const cropImageToCircle = (imageData, size) => {
    return new Promise((resolve) => {
        // Criar imagem
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            const processingSize = size * 8; // Resolução da foto
            
            // Criar canvas temporário com alta resolução
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = processingSize;
            canvas.height = processingSize;
            
            // Limpar canvas com transparência
            ctx.clearRect(0, 0, processingSize, processingSize);
            
            // Criar clipping path circular
            ctx.save();
            ctx.beginPath();
            ctx.arc(processingSize/2, processingSize/2, processingSize/2, 0, 2 * Math.PI);
            ctx.clip();
            
            // Calcular dimensões para manter proporção
            const imgAspect = img.width / img.height;
            const canvasAspect = processingSize / processingSize;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgAspect > canvasAspect) {
                // Imagem mais larga
                drawHeight = processingSize;
                drawWidth = processingSize * imgAspect;
                offsetX = (processingSize - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Imagem mais alta
                drawWidth = processingSize;
                drawHeight = processingSize / imgAspect;
                offsetX = 0;
                offsetY = (processingSize - drawHeight) / 2;
            }
            
            // Desenhar imagem
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            ctx.restore();
            
            // Converter para PNG com transparência e alta qualidade
            const circularImage = canvas.toDataURL('image/png', 1.0);
            resolve(circularImage);
        };
        
        img.onerror = function() {
            // Fallback para imagem original em caso de erro
            resolve(imageData);
        };
        
        img.src = imageData;
    });
};

/**
 * Template 2 - Layout moderno com foto à direita e background colorido
 * Gera um PDF de currículo a partir dos dados fornecidos
 * @param {Object} dadosCurriculo - Objeto contendo todos os dados do currículo
 * @param {string} backgroundColor - Cor de fundo (verde, azul, vermelho)
 * @returns {jsPDF} Documento PDF gerado
 */

export const gerarPDFCurriculo = async (dadosCurriculo, backgroundColor = 'azul') => {
    const doc = new jsPDF();
    
    // ===== CONFIGURAÇÕES DE LAYOUT =====
    const layoutConfig = {
        // Dimensões da página
        pageWidth: 210,
        pageHeight: 297,
        sidebarWidth: 70,
        mainContentWidth: 210 - 70,
        
        // Margens e espaçamentos
        marginLeft: 15,
        marginRight: 15,
        mainMarginLeft: 70 + 15, // sidebarWidth + marginLeft
        
        // Alturas e espaçamentos
        lineHeight: 6,
        sectionSpacing: 7,
        titleSpacing: 20,
        smallSpacing: 3,
        mediumSpacing: 8,
        largeSpacing: 15,
        
        // Posições iniciais
        startY: 20,
        mainStartY: 20,
        
        // Tamanhos de fonte
        titleFontSize: 24,
        sectionTitleFontSize: 12,
        sidebarTitleFontSize: 13,
        normalFontSize: 10,
        sidebarFontSize: 11,
        
        // Tamanho da foto
        photoSize: 50
    };
    
    // ===== CONFIGURAÇÕES DE CORES =====
    const colors = {
        verde: { primary: [76, 175, 80], secondary: [129, 199, 132] },
        azul: { primary: [33, 150, 243], secondary: [100, 181, 246] },
        vermelho: { primary: [244, 67, 54], secondary: [239, 154, 154] }
    };
    
    const selectedColor = colors[backgroundColor] || colors.azul;
    
    // ===== VARIÁVEIS DE POSIÇÃO =====
    let sidebarY = layoutConfig.startY; // Posição na barra lateral
    let mainY = layoutConfig.mainStartY; // Posição no conteúdo principal
    
    // ===== DESENHAR BARRA LATERAL =====
    doc.setFillColor(selectedColor.primary[0], selectedColor.primary[1], selectedColor.primary[2]);
    doc.rect(0, 0, layoutConfig.sidebarWidth, layoutConfig.pageHeight, 'F');
    
    // Adicionar gradiente sutil na barra lateral
    doc.setFillColor(selectedColor.secondary[0], selectedColor.secondary[1], selectedColor.secondary[2]);
    doc.rect(0, 0, layoutConfig.sidebarWidth, 50, 'F');
    
    // ===== SEÇÃO: FOTO =====
    if (dadosCurriculo.foto) {
        const xCenter = layoutConfig.sidebarWidth / 2;
        
        try {
            // Recortar imagem para formato circular com alta resolução
            const circularImage = await cropImageToCircle(dadosCurriculo.foto, layoutConfig.photoSize);
            
            // Adicionar imagem circular recortada com PNG para preservar transparência
            doc.addImage(circularImage, 'PNG', xCenter - layoutConfig.photoSize/2, sidebarY, layoutConfig.photoSize, layoutConfig.photoSize, undefined, 'FAST');
        } catch (error) {
            console.warn('Erro ao recortar imagem, usando imagem original:', error);

            // Fallback: adicionar imagem original
            doc.addImage(dadosCurriculo.foto, 'JPEG', xCenter - layoutConfig.photoSize/2, sidebarY, layoutConfig.photoSize, layoutConfig.photoSize, undefined, 'FAST');
        }
        
        sidebarY += layoutConfig.photoSize + layoutConfig.largeSpacing;
    }
    
    // ===== SEÇÃO: CONTATO (BARRA LATERAL) =====
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(layoutConfig.sidebarTitleFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("Contato", layoutConfig.sidebarWidth / 2, sidebarY, { align: "center" });
    sidebarY += layoutConfig.mediumSpacing;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(layoutConfig.sidebarFontSize);
    
    // Email
    if (dadosCurriculo.email) {
        const emailLines = doc.splitTextToSize(dadosCurriculo.email, layoutConfig.sidebarWidth - 10);
        emailLines.forEach(line => {
            doc.text(line, layoutConfig.sidebarWidth / 2, sidebarY, { align: "center" });
            sidebarY += 5; // Aumentado espaçamento de 4 para 5
        });
        sidebarY += layoutConfig.smallSpacing;
    }
    
    // Telefone
    if (dadosCurriculo.telefone) {
        const phoneLines = doc.splitTextToSize(dadosCurriculo.telefone, layoutConfig.sidebarWidth - 10);
        phoneLines.forEach(line => {
            doc.text(line, layoutConfig.sidebarWidth / 2, sidebarY, { align: "center" });
            sidebarY += 5; // Aumentado espaçamento de 4 para 5
        });
        sidebarY += layoutConfig.mediumSpacing;
    }
    
    // ===== SEÇÃO: ENDEREÇO (BARRA LATERAL) =====
    doc.setFont("helvetica", "bold");
    doc.text("Endereço", layoutConfig.sidebarWidth / 2, sidebarY, { align: "center" });
    sidebarY += layoutConfig.mediumSpacing;
    
    doc.setFont("helvetica", "normal");
    const endereco = `${dadosCurriculo.rua}, ${dadosCurriculo.numero}`;
    const enderecoLines = doc.splitTextToSize(endereco, layoutConfig.sidebarWidth - 10);
    enderecoLines.forEach(line => {
        doc.text(line, layoutConfig.sidebarWidth / 2, sidebarY, { align: "center" });
        sidebarY += 5; // Aumentado espaçamento de 4 para 5
    });
    sidebarY += layoutConfig.smallSpacing;
    
    const cidadeEstado = `${dadosCurriculo.cidade} - ${dadosCurriculo.estado}`;
    const cidadeEstadoLines = doc.splitTextToSize(cidadeEstado, layoutConfig.sidebarWidth - 10);
    cidadeEstadoLines.forEach(line => {
        doc.text(line, layoutConfig.sidebarWidth / 2, sidebarY, { align: "center" });
        sidebarY += 5; // Aumentado espaçamento de 4 para 5
    });
    
    // ===== CONTEÚDO PRINCIPAL (LADO DIREITO) =====
    doc.setTextColor(0, 0, 0);
    
    // ===== SEÇÃO: NOME =====
    doc.setFontSize(layoutConfig.titleFontSize);
    doc.setFont("helvetica", "bold");
    doc.text(dadosCurriculo.nome, layoutConfig.mainMarginLeft, mainY);
    mainY += layoutConfig.titleSpacing;
    
    mainY += layoutConfig.sectionSpacing;
    
    // ===== SEÇÃO: RESUMO =====
    if (dadosCurriculo.resumo) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(layoutConfig.sectionTitleFontSize);
        doc.text("Resumo", layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(layoutConfig.normalFontSize);
        const resumoLines = doc.splitTextToSize(dadosCurriculo.resumo, layoutConfig.mainContentWidth - 30);
        doc.text(resumoLines, layoutConfig.mainMarginLeft, mainY);
        mainY += (resumoLines.length * layoutConfig.lineHeight) + 5; // Reduzido espaçamento
    }
    
    // ===== SEÇÃO: HABILIDADES =====
    const tecnicas = dadosCurriculo.habilidadesTecnicas ? 
        dadosCurriculo.habilidadesTecnicas.split(',').map(s => s.trim()).filter(s => s) : [];
    const pessoais = dadosCurriculo.habilidadesPessoais ? 
        dadosCurriculo.habilidadesPessoais.split(',').map(s => s.trim()).filter(s => s) : [];
    
    if (tecnicas.length > 0 || pessoais.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(layoutConfig.sectionTitleFontSize);
        doc.text("Habilidades", layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        
        if (tecnicas.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(layoutConfig.normalFontSize);
            doc.text("Técnicas:", layoutConfig.mainMarginLeft, mainY);
            mainY += layoutConfig.lineHeight;
            doc.setFont("helvetica", "normal");
            const skillsText = tecnicas.join(' • ');
            const skillsLines = doc.splitTextToSize(skillsText, layoutConfig.mainContentWidth - 30);
            doc.text(skillsLines, layoutConfig.mainMarginLeft, mainY);
            mainY += (skillsLines.length * layoutConfig.lineHeight);
        }
        
        if (pessoais.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(layoutConfig.normalFontSize);
            doc.text("Pessoais:", layoutConfig.mainMarginLeft, mainY);
            mainY += layoutConfig.lineHeight;
            doc.setFont("helvetica", "normal");
            const skillsText = pessoais.join(' • ');
            const skillsLines = doc.splitTextToSize(skillsText, layoutConfig.mainContentWidth - 30);
            doc.text(skillsLines, layoutConfig.mainMarginLeft, mainY);
            mainY += (skillsLines.length * layoutConfig.lineHeight);
        }
        
        mainY += 5; // Reduzido espaçamento
    }
    
    // ===== SEÇÃO: FORMAÇÃO ACADÊMICA =====
    if (dadosCurriculo.formacaoCurso) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(layoutConfig.sectionTitleFontSize);
        doc.text("Formação Acadêmica", layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(layoutConfig.normalFontSize);
        doc.text(`Curso: ${dadosCurriculo.formacaoCurso}`, layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        doc.text(`Instituição: ${dadosCurriculo.formacaoInstituicao || 'Não informada'}`, layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        doc.text(`Período: ${dadosCurriculo.formacaoInicio || ''} - ${dadosCurriculo.formacaoTermino || ''}`, layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        
        if (dadosCurriculo.formacaoDescricao) {
            const descLines = doc.splitTextToSize(dadosCurriculo.formacaoDescricao, layoutConfig.mainContentWidth - 30);
            doc.text(descLines, layoutConfig.mainMarginLeft, mainY);
            mainY += (descLines.length * layoutConfig.lineHeight);
        }
        
        mainY += 5; // Reduzido espaçamento
    }
    
    // ===== SEÇÃO: EXPERIÊNCIA PROFISSIONAL =====
    if (!dadosCurriculo.semExperiencia && dadosCurriculo.expCargo) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(layoutConfig.sectionTitleFontSize);
        doc.text("Experiência Profissional", layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(layoutConfig.normalFontSize);
        doc.text(`Cargo: ${dadosCurriculo.expCargo}`, layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        doc.text(`Empresa: ${dadosCurriculo.expEmpresa || 'Não informada'}`, layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        const expTermino = dadosCurriculo.expAtual ? 'Atualmente' : dadosCurriculo.expTermino;
        doc.text(`Período: ${dadosCurriculo.expInicio || ''} - ${expTermino || ''}`, layoutConfig.mainMarginLeft, mainY);
        mainY += layoutConfig.lineHeight;
        
        if (dadosCurriculo.expDescricao) {
            const descLines = doc.splitTextToSize(dadosCurriculo.expDescricao, layoutConfig.mainContentWidth - 30);
            doc.text(descLines, layoutConfig.mainMarginLeft, mainY);
            mainY += (descLines.length * layoutConfig.lineHeight);
        }
    }
    
    return doc;
};

/**
 * Faz o download do PDF gerado
 * @param {Object} dadosCurriculo
 * @param {string} nomeArquivo 
 * @param {string} backgroundColor 
 */

export const downloadPDFCurriculo = async (dadosCurriculo, nomeArquivo = null, backgroundColor = 'azul') => {
    try {
        const doc = await gerarPDFCurriculo(dadosCurriculo, backgroundColor);
        const fileName = nomeArquivo || `curriculo_${dadosCurriculo.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        
        // Download do PDF
        doc.save(fileName);

    } catch (error) {
        console.error('Erro ao fazer download do PDF:', error);
        throw error;
    }
}; 