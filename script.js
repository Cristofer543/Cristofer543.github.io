// script.js
const username = "Cristofer543"; // Reemplaza con tu nombre de usuario de GitHub
const apiUrl = `https://api.github.com/users/${username}/repos`;

// Obtén la lista de repositorios desde la API de GitHub
fetch(apiUrl)
    .then(response => response.json())
    .then(projectsData => {
        const projectGallery = document.getElementById("projectGallery");

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
                <a href="${projectUrl}" target="_blank">Ver en GitHub <i class="fas fa-external-link-alt"></i></a>
            `;

            const modal = document.getElementById("projectModal");
            modal.style.display = "block";
        })
        .catch(error => console.error("Error fetching GitHub project details:", error));
}

function generateProjectInfo(projectDetails) {
    const creationDate = new Date(projectDetails.created_at);
    const formattedDate = creationDate.toLocaleDateString();

    const description = projectDetails.description
        ? `Descripción: ${projectDetails.description}`
        : "Descripción: No disponible";

    const owner = projectDetails.owner.login;

    const contributors = projectDetails.contributors_url
        ? fetch(projectDetails.contributors_url)
            .then(response => response.json())
            .then(contributors => contributors.map(contributor => contributor.login).join(', '))
        : "No disponible";

    const language = projectDetails.language || "No disponible";

    return {
        creationDate: `Este proyecto fue creado el ${formattedDate}.`,
        description: description,
        owner: owner,
        contributors: contributors,
        language: language
    };
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