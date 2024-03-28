// script.js
const username = "Cristofer543"; // Reemplaza con tu nombre de usuario de GitHub
const apiUrl = `https://api.github.com/users/${username}/repos`;

// Obtén la lista de repositorios desde la API de GitHub
fetch(apiUrl)
    .then(response => response.json())
    .then(projectsData => {
        const projectGallery = document.getElementById("projectGallery");

        // Ordenar los proyectos por fecha de actualización descendente
        projectsData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        projectsData.forEach(project => {
            const projectElement = document.createElement("div");
            projectElement.classList.add("project");
            projectElement.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description || "Sin descripción disponible"}</p>
                <a href="#" onclick="openModal('${project.name}', '${project.html_url}'); return false;">Ver más <i class="fas fa-external-link-alt"></i></a>
            `;
            projectGallery.appendChild(projectElement);
        });
    })
    .catch(error => console.error("Error fetching GitHub projects:", error));

function openModal(projectName, projectUrl) {
    const modalContent = document.getElementById("modalContent");
    fetch(`https://api.github.com/repos/${username}/${projectName}`)
        .then(response => response.json())
        .then(projectDetails => {
            const projectInfo = generateProjectInfo(projectDetails);
            modalContent.innerHTML = `
                <span class="close-modal" onclick="closeModal()">&times;</span>
                <h2>${projectName}</h2>
                <p>${projectInfo.creationDate}</p>
                <p>${projectInfo.description}</p>
                <p>Desarrollador: ${projectInfo.owner}</p>
                <p>Contribuidores: ${projectInfo.contributors}</p>
                <p>Lenguaje principal: ${projectInfo.language}</p>
                <p>Última actualización: ${projectInfo.lastUpdate}</p>
                <a href="${projectUrl}" target="_blank">Ver en GitHub <i class="fas fa-external-link-alt"></i></a>
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

    const description = projectDetails.description
        ? `Descripción: ${projectDetails.description}`
        : "Descripción: No disponible";

    const owner = projectDetails.owner.login;

    const contributors = projectDetails.contributors_url
        ? fetchContributors(projectDetails.contributors_url)
        : "No disponible";

    const language = projectDetails.language || "No disponible";

    return {
        creationDate: `Este proyecto fue creado el ${formattedCreationDate}.`,
        description: description,
        owner: owner,
        contributors: contributors,
        language: language,
        lastUpdate: `Última actualización: ${formattedLastUpdate}`
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
contactForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Aquí puedes agregar la lógica para enviar el formulario, por ejemplo, mediante una solicitud AJAX
    console.log("Nombre:", name);
    console.log("Correo electrónico:", email);
    console.log("Mensaje:", message);

    // Restablecer los campos del formulario
    contactForm.reset();
});

// Botón para ir a la página de usuario de GitHub
const goToUserPageBtn = document.getElementById("goToUserPageBtn");
goToUserPageBtn.href = `https://github.com/${username}`;