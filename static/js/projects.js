document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/projects')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('project-container');

            if (!container) {
                console.error('Projects container not found');
                return;
            }

            data.projects.forEach(project => {
                const projectCard = document.createElement('comp-project-card');
                projectCard.setAttribute('id', project.id);
                projectCard.setAttribute('title', project.title);
                projectCard.setAttribute('owner', project.owner);
                container.appendChild(projectCard);
            });

        })

        .catch(error => {
            console.error('Error fetching projects:', error);
        });
});