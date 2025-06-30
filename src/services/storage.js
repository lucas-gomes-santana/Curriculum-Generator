import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc 
} from 'firebase/firestore';
import jsPDF from 'jspdf';

// Salvar currículo apenas no Firestore (sem Storage)
export const salvarCurriculo = async (dadosCurriculo, userId) => {
  try {
    // Salvar dados do currículo no Firestore
    const curriculoData = {
      userId: userId,
      nome: dadosCurriculo.nome,
      email: dadosCurriculo.email,
      telefone: dadosCurriculo.telefone,
      cidade: dadosCurriculo.cidade,
      estado: dadosCurriculo.estado,
      cep: dadosCurriculo.cep,
      rua: dadosCurriculo.rua,
      numero: dadosCurriculo.numero,
      resumo: dadosCurriculo.resumo,
      formacaoInstituicao: dadosCurriculo.formacaoInstituicao,
      formacaoCurso: dadosCurriculo.formacaoCurso,
      formacaoInicio: dadosCurriculo.formacaoInicio,
      formacaoTermino: dadosCurriculo.formacaoTermino,
      expEmpresa: dadosCurriculo.expEmpresa,
      expCargo: dadosCurriculo.expCargo,
      expInicio: dadosCurriculo.expInicio,
      expTermino: dadosCurriculo.expTermino,
      expAtual: dadosCurriculo.expAtual,
      expDescricao: dadosCurriculo.expDescricao,
      semExperiencia: dadosCurriculo.semExperiencia,
      foto: dadosCurriculo.foto, // base64 da foto
      dataCriacao: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'curriculos'), curriculoData);
    
    return {
      id: docRef.id,
      ...curriculoData
    };
  } catch (error) {
    console.error('Erro ao salvar currículo:', error);
    throw error;
  }
};

// Buscar currículos do usuário
export const buscarCurriculosUsuario = async (userId) => {
  try {
    // Consulta simples sem ordenação para evitar necessidade de índice
    const q = query(
      collection(db, 'curriculos'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const curriculos = [];
    
    querySnapshot.forEach((doc) => {
      curriculos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Ordenar no cliente (JavaScript) em vez de no servidor
    curriculos.sort((a, b) => {
      const dataA = a.dataCriacao?.toDate ? a.dataCriacao.toDate() : new Date(a.dataCriacao);
      const dataB = b.dataCriacao?.toDate ? b.dataCriacao.toDate() : new Date(b.dataCriacao);
      return dataB - dataA; // Ordem decrescente (mais recente primeiro)
    });
    
    return curriculos;
  } catch (error) {
    console.error('Erro ao buscar currículos:', error);
    throw error;
  }
};

// Deletar currículo
export const deletarCurriculo = async (curriculoId) => {
  try {
    // Deletar documento do Firestore
    await deleteDoc(doc(db, 'curriculos', curriculoId));
    return true;
  } catch (error) {
    console.error('Erro ao deletar currículo:', error);
    throw error;
  }
};

// Gerar PDF a partir dos dados salvos
export const gerarPDFFromData = (curriculoData) => {
  const doc = new jsPDF();
  let y = 15;
  const marginLeft = 15;
  const lineHeight = 6;
  const sectionSpacing = 7;

  // Foto (se houver)
  if (curriculoData.foto) {
    const imgSize = 40;
    const xCenter = (210 - imgSize) / 2;
    doc.setFillColor(255,255,255);
    doc.circle(105, y + imgSize/2, imgSize/2 + 2, 'F');
    doc.addImage(curriculoData.foto, 'JPEG', xCenter, y, imgSize, imgSize, undefined, 'FAST');
    y += imgSize + 10;
  }

  // Nome
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(curriculoData.nome, 105, y, { align: "center" });
  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(marginLeft, y, 200 - marginLeft, y);
  y += sectionSpacing;

  // Contato
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Contato:", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${curriculoData.email} | Telefone: ${curriculoData.telefone}`, marginLeft + 25, y);
  y += lineHeight;
  
  // Endereço
  doc.setFont("helvetica", "bold");
  doc.text("Endereço:", marginLeft, y);
  doc.setFont("helvetica", "normal");
  const endereco = `${curriculoData.rua}, ${curriculoData.numero} - ${curriculoData.cidade} - ${curriculoData.estado} - CEP: ${curriculoData.cep}`;
  doc.text(endereco, marginLeft + 25, y);
  y += sectionSpacing;
  doc.line(marginLeft, y, 200 - marginLeft, y);
  y += sectionSpacing;

  // Resumo
  doc.setFont("helvetica", "bold");
  doc.text("Resumo Profissional:", marginLeft, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  const resumoLines = doc.splitTextToSize(curriculoData.resumo, 180);
  doc.text(resumoLines, marginLeft, y);
  y += (resumoLines.length * lineHeight); 
  doc.line(marginLeft, y, 200 - marginLeft, y);
  y += sectionSpacing;

  // Formação Acadêmica
  doc.setFont("helvetica", "bold");
  doc.text("Formação Acadêmica:", marginLeft, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  const formacaoText = [
    `Curso: ${curriculoData.formacaoCurso}`,
    `Instituição de Ensino: ${curriculoData.formacaoInstituicao}`,
    `${curriculoData.formacaoInicio} - ${curriculoData.formacaoTermino}`,
    `${curriculoData.formacaoDescricao}`
  ];
  formacaoText.forEach(line => {
    if (line.trim()) {
      const wrappedLines = doc.splitTextToSize(line, 180);
      doc.text(wrappedLines, marginLeft, y);
      y += (wrappedLines.length * lineHeight);
    }
  });
  y += 5;
  doc.line(marginLeft, y, 200 - marginLeft, y);
  y += sectionSpacing;

  // Experiência Profissional
  if (!curriculoData.semExperiencia) {
    doc.setFont("helvetica", "bold");
    doc.text("Experiência Profissional:", marginLeft, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    const expTermino = curriculoData.expAtual ? "Atualmente" : curriculoData.expTermino;
    const experienciaText = [
      `Cargo: ${curriculoData.expCargo}`,
      `Empresa: ${curriculoData.expEmpresa}`,
      `${curriculoData.expInicio} - ${expTermino}`,
      `${curriculoData.expDescricao}`
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

// Download do PDF gerado a partir dos dados
export const downloadCurriculo = async (curriculoData) => {
  try {
    const doc = gerarPDFFromData(curriculoData);
    const fileName = `curriculo_${curriculoData.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    
    // Download do PDF
    doc.save(fileName);
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    throw error;
  }
}; 