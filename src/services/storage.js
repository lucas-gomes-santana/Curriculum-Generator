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
import { downloadPDFCurriculo as downloadTemplate1 } from '../templates/template1';
import { downloadPDFCurriculo as downloadTemplate2 } from '../templates/template2';

// Salvar currículo no Firestore
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
      template: dadosCurriculo.template || 'template1',
      backgroundColor: dadosCurriculo.backgroundColor || null,
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

// Excluir currículo
export const deletarCurriculo = async (curriculoId) => {
  try {
    // Excluir documento do Firestore
    await deleteDoc(doc(db, 'curriculos', curriculoId));
    return true;
  } catch (error) {
    console.error('Erro ao deletar currículo:', error);
    throw error;
  }
};

// Download do PDF gerado a partir dos dados
export const downloadCurriculo = async (curriculoData) => {
  try {
    const fileName = `curriculo_${curriculoData.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const template = curriculoData.template || 'template1';
    if (template === 'template2') {
      const backgroundColor = curriculoData.backgroundColor || 'azul';
      await downloadTemplate2(curriculoData, fileName, backgroundColor);
    } else {
      downloadTemplate1(curriculoData, fileName);
    }
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    throw error;
  }
}; 