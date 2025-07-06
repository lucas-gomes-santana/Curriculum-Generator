import { useEffect } from 'react';
import { gerarPDFCurriculo } from '../templates/template1';
import '../styles/CurriculoModal.css';

function CurriculoModal({ curriculo, isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !curriculo) return null;

  const handleDownload = () => {
    try {
      const doc = gerarPDFCurriculo(curriculo);
      const fileName = `curriculo_${curriculo.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Visualizar Currículo</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <div className="curriculo-preview">
            <div className="preview-header">
              <h3>{curriculo.nome}</h3>
              <p className="email">{curriculo.email}</p>
            </div>
            
            <div className="preview-content">
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
                  <p><strong>Instituição:</strong> {curriculo.formacaoInstituicao}</p>
                  <p><strong>Período:</strong> {curriculo.formacaoInicio} - {curriculo.formacaoTermino}</p>
                  {curriculo.formacaoDescricao && (
                    <p><strong>Descrição:</strong> {curriculo.formacaoDescricao}</p>
                  )}
                </div>
              )}

              {!curriculo.semExperiencia && curriculo.expCargo && (
                <div className="info-section">
                  <h4>Experiência Profissional</h4>
                  <p><strong>Cargo:</strong> {curriculo.expCargo}</p>
                  <p><strong>Empresa:</strong> {curriculo.expEmpresa}</p>
                  <p><strong>Período:</strong> {curriculo.expInicio} - {curriculo.expAtual ? 'Atualmente' : curriculo.expTermino}</p>
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

        <div className="modal-footer">
          <button className="btn-download" onClick={handleDownload}>
            📥 Download PDF
          </button>
          <button className="btn-close" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CurriculoModal; 