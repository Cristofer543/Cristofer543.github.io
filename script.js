const username = "Cristofer543"; // Reemplaza con tu nombre de usuario de GitHub
const apiUrl = `https://api.github.com/users/${username}/repos`;

let projectsData = [];
let currentPage = 1;
const projectsPerPage = 6;

// Obtén la lista de repositorios desde la API de GitHub
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    projectsData = data;
    renderProjects();
    setupLanguageFilter();
  })
  .catch(error => console.error("Error fetching GitHub projects:", error));

// Función para renderizar los proyectos
function renderProjects() {
  const projectGallery = document.getElementById("projectGallery");
  projectGallery.innerHTML = "";

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const projectsToRender = projectsData.slice(startIndex, endIndex);

  projectsToRender.forEach(project => {
    const projectElement = createProjectElement(project);
    projectGallery.appendChild(projectElement);
  });

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (endIndex >= projectsData.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
  }

  filterProjects();
}

// Función para generar elementos de proyecto
function createProjectElement(project) {
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");
  projectElement.innerHTML = `
    <h3>${project.name}</h3>
    <p>${project.description || "Sin descripción disponible"}</p>
    <a href="#" onclick="openModal('${project.name}', '${project.html_url}'); return false;">Ver más <i class="fas fa-external-link-alt"></i></a>
  `;
  return projectElement;
}

// Función para filtrar y renderizar los proyectos
function filterProjects() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const selectedLanguage = document.getElementById("languageFilter").value;

  const filteredProjects = projectsData.filter(project => {
    const projectName = project.name.toLowerCase();
    const projectLanguage = project.language || "Otros";

    return (
      projectName.includes(searchTerm) &&
      (selectedLanguage === "" || projectLanguage === selectedLanguage)
    );
  });

  renderProjects(filteredProjects);
}

// Función para configurar el filtro de lenguaje
function setupLanguageFilter() {
  const languageFilter = document.getElementById("languageFilter");
  const languages = new Set(projectsData.map(project => project.language));

  languages.forEach(language => {
    const option = document.createElement("option");
    option.value = language || "Otros";
    option.textContent = language || "Otros";
    languageFilter.appendChild(option);
  });
}

function openModal(projectName, projectUrl) {
  const modalContent = document.getElementById("modalContent");
  fetch(`https://api.github.com/repos/${username}/${projectName}`)
    .then(response => response.json())
    .then(projectDetails => {
      const projectInfo = generateProjectInfo(projectDetails);
      modalContent.innerHTML = `
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <h2>${projectName}</h2>
        <p>${projectInfo.description}</p>
        <p>Desarrollador: ${projectInfo.owner}</p>
        <p>Contribuidores: ${projectInfo.contributors}</p>
        <p>Lenguaje principal: ${projectInfo.language}</p>
        <p>Última actualización: ${projectInfo.lastUpdate}</p>
        <p>URL del repositorio: <a href="${projectUrl}" target="_blank">${projectUrl}</a></p>
        ${projectInfo.homepage ? `<p>Página web: <a href="${projectInfo.homepage}" target="_blank">${projectInfo.homepage}</a></p>` : ''}
      `;

      const modal = document.getElementById("projectModal");
      modal.style.display = "block";
    })
    .catch(error => console.error("Error fetching GitHub project details:", error));
}

function generateProjectInfo(projectDetails) {
  const creationDate = new Date(projectDetails.created_at);
  const formattedCreationDate = creationDate.toLocaleDateString();

  const lastUpdate = new Date(projectDetails.updated_at);
  const formattedLastUpdate = lastUpdate.toLocaleDateString();

  const description = projectDetails.description || "Sin descripción disponible";

  const owner = projectDetails.owner.login;

  const contributors = projectDetails.contributors_url
    ? fetchContributors(projectDetails.contributors_url)
    : "No disponible";

  const language = projectDetails.language || "No disponible";

  const homepage = projectDetails.homepage || null;

  return {
    description: description,
    owner: owner,
    contributors: contributors,
    language: language,
    lastUpdate: `Última actualización: ${formattedLastUpdate}`,
    homepage: homepage
  };
}

function fetchContributors(contributorsUrl) {
  return fetch(contributorsUrl)
    .then(response => response.json())
    .then(contributors => contributors.map(contributor => contributor.login).join(', '))
    .catch(error => console.error("Error fetching contributors:", error));
}

function closeModal() {
  const modal = document.getElementById("projectModal");
  modal.style.display = "none";
}

// Envío de formulario de contacto
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Evitar el envío del formulario

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Aquí puedes agregar la lógica para enviar el formulario, por ejemplo, mediante una solicitud AJAX
  console.log("Nombre:", name);
  console.log("Correo electrónico:", email);
  console.log("Mensaje:", message);

  // Simular envío exitoso del formulario
  formStatus.textContent = "Mensaje enviado correctamente";
  formStatus.style.color = "green";

  // Restablecer los campos del formulario
  contactForm.reset();

  // Limpiar el mensaje de estado después de 3 segundos
  setTimeout(() => {
    formStatus.textContent = "";
  }, 3000);
});

// Botón para ir a la página de usuario de GitHub
const goToUserPageBtn = document.getElementById("goToUserPageBtn");
goToUserPageBtn.href = `https://github.com/${username}`;

// Botón para cargar más proyectos
const loadMoreBtn = document.getElementById("loadMoreBtn");
loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  renderProjects();
});

// Menú de navegación para dispositivos móviles
const toggleMenu = document.querySelector(".toggle-menu");
const navLinks = document.querySelector("nav ul");

toggleMenu.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});