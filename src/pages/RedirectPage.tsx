import "../styles/RedirectPage.css";

function Redirect() {
  return (
    <div className="farewell-container">
      <div className="farewell-card">
        <h1>Olá caro Usuário</h1>

        <p className="farewell-text">
          Sinto muito em informar, mas este projeto foi encerrado, mas não é o
          fim.
        </p>

        <p className="farewell-text">
          Confira a nova versão melhorada do Curriculum Generator clicando
          abaixo
        </p>

        <a
          href="#"
          className="farewell-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Conhecer o novo site
        </a>
      </div>
    </div>
  );
}

export default Redirect;
