import './about.css';  // Importamos el archivo CSS

const About = () => {
  return (
    <section className="about-section">
      <h1 className="about-title">Acerca de Nosotros</h1>
      <p className="about-description">
        Somos un equipo apasionado por la tecnología, la innovación y la
        excelencia. Nuestra misión es ofrecer soluciones que mejoren la calidad
        de vida de nuestros clientes a través de productos de alta calidad y un
        servicio al cliente excepcional.
      </p>
      <h2 className="about-subtitle">Nuestros Valores</h2>
      <ul className="about-list">
        <li>Compromiso</li>
        <li>Innovación</li>
        <li>Calidad</li>
        <li>Transparencia</li>
        <li>Trabajo en equipo</li>
      </ul>
      <h2 className="about-subtitle">Nuestro Equipo</h2>
      <p className="about-description">
        Contamos con un equipo multidisciplinario de expertos que trabajan
        juntos para lograr resultados sobresalientes en cada proyecto.
      </p>
    </section>
  );
};

export default About;
