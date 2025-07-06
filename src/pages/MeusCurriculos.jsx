import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { 
  buscarCurriculosUsuario, 
  deletarCurriculo
} from "../services/storage";
import { downloadPDFCurriculo as downloadTemplate1 } from "../templates/template1";
import { downloadPDFCurriculo as downloadTemplate2 } from "../templates/template2";


import "../styles/MeusCurriculos.css";

function MeusCurriculos() {
  const [curriculos, setCurriculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);


  useEffect(() => {
    carregarCurriculos();
  }, []);

  const carregarCurriculos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!auth.currentUser) {
        setError("Usuário não autenticado");
        setLoading(false);
        return;
      }

      const curriculosData = await buscarCurriculosUsuario(auth.currentUser.uid);
      setCurriculos(curriculosData);
    } catch (err) {
      setError("Erro ao carregar currículos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (curriculo) => {
    try {
      // Usar o template correto baseado nos dados salvos
      const template = curriculo.template || 'template1';
      const backgroundColor = curriculo.backgroundColor || 'azul';
      
      if (template === 'template1') {
        downloadTemplate1(curriculo, `curriculo_${curriculo.nome}.pdf`);
      } else if (template === 'template2') {
        await downloadTemplate2(curriculo, `curriculo_${curriculo.nome}.pdf`, backgroundColor);
      } else {
        // Fallback para template1 se não especificado
        downloadTemplate1(curriculo, `curriculo_${curriculo.nome}.pdf`);
      }
    } catch (err) {
      setError("Erro ao fazer download: " + err.message);
    }
  };

  const handleDelete = async (curriculo) => {
    if (!window.confirm("Tem certeza que deseja excluir este currículo?")) {
      return;
    }

    try {
      setDeletingId(curriculo.id);
      await deletarCurriculo(curriculo.id);
      
      // Remover da lista local
      setCurriculos(prev => prev.filter(c => c.id !== curriculo.id));
    } catch (err) {
      setError("Erro ao deletar currículo: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };





  const formatarData = (data) => {
    if (!data) return "Data não disponível";
    
    const date = data.toDate ? data.toDate() : new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="meus-curriculos-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando seus currículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meus-curriculos-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={carregarCurriculos}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="meus-curriculos-container">
      
      <div className="header">
        <h1>Meus Currículos</h1>
        <button onClick={carregarCurriculos} className="refresh-btn">
          🔄 Atualizar
        </button>
      </div>

      {curriculos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>Nenhum currículo encontrado</h3>
          <p>Você ainda não salvou nenhum currículo. Crie um novo currículo para vê-lo aqui!</p>
        </div>
      ) : (
        <div className="curriculos-grid">
          {curriculos.map((curriculo) => (
            <div key={curriculo.id} className="curriculo-card">

              <div className="curriculo-header">

                <div className="curriculo-info">

                  <h3>{curriculo.nome || "Currículo sem nome"}</h3>
                  <p className="email">{curriculo.email}</p>
                  <p className="data">
                    Criado em: {formatarData(curriculo.dataCriacao)}
                  </p>
                  <p className="template-info">
                    Template: {curriculo.template === 'template2' ? 'Moderno' : 'Clássico'}
                    {curriculo.backgroundColor && ` (${curriculo.backgroundColor})`}
                  </p>

                </div>

                <div className="curriculo-actions">
                  <button
                    onClick={() => handleDownload(curriculo)}
                    className="btn-download"
                    title="Download PDF"
                  >
                    📥 Download
                  </button>

                  <button
                    onClick={() => handleDelete(curriculo)}
                    className="btn-delete"
                    disabled={deletingId === curriculo.id}
                    title="Deletar currículo"
                  >
                    {deletingId === curriculo.id ? "🗑️ Excluindo..." : "🗑️ Excluir"}
                  </button>

                </div>

              </div>
              
              <div className="curriculo-preview">
                <div className="preview-content">
                  <div className="preview-header">
                    <h3>{curriculo.nome}</h3>
                    <p className="email">{curriculo.email}</p>
                  </div>
                  
                  <div className="preview-sections">
                    <div className="info-section">
                      <h4>Informações de Contato</h4>
                      <p><strong>Telefone:</strong> {curriculo.telefone || 'Não informado'}</p>
                      <p><strong>Endereço:</strong> {curriculo.rua}, {curriculo.numero} - {curriculo.cidade} - {curriculo.estado}</p>
                    </div>

                    {curriculo.resumo && (
                      <div className="info-section">
                        <h4>Resumo Profissional</h4>
                        <p>{curriculo.resumo}</p>
                      </div>
                    )}

                    {curriculo.formacaoCurso && (
                      <div className="info-section">
                        <h4>Formação Acadêmica</h4>
                        <p><strong>Curso:</strong> {curriculo.formacaoCurso}</p>
                        <p><strong>Instituição:</strong> {curriculo.formacaoInstituicao || 'Não informada'}</p>
                        <p><strong>Período:</strong> {curriculo.formacaoInicio || ''} - {curriculo.formacaoTermino || ''}</p>
                        {curriculo.formacaoDescricao && (
                          <p><strong>Descrição:</strong> {curriculo.formacaoDescricao}</p>
                        )}
                      </div>
                    )}

                    {!curriculo.semExperiencia && curriculo.expCargo && (
                      <div className="info-section">
                        <h4>Experiência Profissional</h4>
                        <p><strong>Cargo:</strong> {curriculo.expCargo}</p>
                        <p><strong>Empresa:</strong> {curriculo.expEmpresa || 'Não informada'}</p>
                        <p><strong>Período:</strong> {curriculo.expInicio || ''} - {curriculo.expAtual ? 'Atualmente' : curriculo.expTermino || ''}</p>
                        {curriculo.expDescricao && (
                          <p><strong>Descrição:</strong> {curriculo.expDescricao}</p>
                        )}
                      </div>
                    )}

                    {(curriculo.habilidadesTecnicas || curriculo.habilidadesPessoais) && (
                      <div className="info-section">
                        <h4>Habilidades</h4>
                        {curriculo.habilidadesTecnicas && (
                          <div>
                            <p><strong>Técnicas:</strong></p>
                            <p>{curriculo.habilidadesTecnicas}</p>
                          </div>
                        )}
                        {curriculo.habilidadesPessoais && (
                          <div>
                            <p><strong>Pessoais:</strong></p>
                            <p>{curriculo.habilidadesPessoais}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusCurriculos; 