import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { 
  buscarCurriculosUsuario, 
  deletarCurriculo, 
  downloadCurriculo 
} from "../services/storage";
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
      await downloadCurriculo(curriculo);
    } catch (err) {
      setError("Erro ao fazer download: " + err.message);
    }
  };

  const handleDelete = async (curriculo) => {
    if (!window.confirm("Tem certeza que deseja deletar este currículo?")) {
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
                <div className="preview-info">
                  <div className="info-item">
                    <strong>Telefone:</strong> 
                    <span>{curriculo.telefone || "Não informado"}</span>
                  </div>
                  <div className="info-item">
                    <strong>Cidade:</strong> 
                    <span>{curriculo.cidade || "Não informada"}</span>
                  </div>
                  <div className="info-item">
                    <strong>Estado:</strong> 
                    <span>{curriculo.estado || "Não informado"}</span>
                  </div>
                  {curriculo.formacaoCurso && (
                    <div className="info-item">
                      <strong>Formação:</strong> 
                      <span>{curriculo.formacaoCurso}</span>
                    </div>
                  )}
                  {curriculo.expCargo && (
                    <div className="info-item">
                      <strong>Último cargo:</strong> 
                      <span>{curriculo.expCargo}</span>
                    </div>
                  )}
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