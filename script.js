// ==========================================
// ADITHYA'S PORTFOLIO SCRIPT
// ==========================================

const $ = (id) => document.getElementById(id);

const esc = (value) => {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
};

const safeUrl = (url) => {
    try {
        const parsed = new URL(url);

        if (
            parsed.protocol === "https:" ||
            parsed.protocol === "http:"
        ) {
            return parsed.href;
        }

        return "#";
    } catch {
        return "#";
    }
};

// ==========================================
// LOAD PORTFOLIO
// ==========================================

async function loadPortfolio() {

    try {

        const response = await fetch("./profile.json");

        if (!response.ok) {
            throw new Error(
                "Could not load profile.json: " + response.status
            );
        }

        const profile = await response.json();

        // Website title
        document.title = profile.name + " | Portfolio";

        // Hero
        $("name").textContent = profile.name || "";
        $("tagline").textContent = profile.tagline || "";

        // About
        $("bio").textContent = profile.bio || "";

        // Skills
        $("skills").innerHTML = (profile.skills || [])
            .map((skill) => {
                return `<li>${esc(skill)}</li>`;
            })
            .join("");

        // Projects
        $("projects").innerHTML = (profile.projects || [])
            .map((project) => {
                return `
                    <div class="card">

                        <h3>${esc(project.title)}</h3>

                        <p>${esc(project.desc)}</p>

                        <a
                            href="${esc(safeUrl(project.link))}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Project ↗
                        </a>

                    </div>
                `;
            })
            .join("");

        // Social links
        $("links").innerHTML = Object.entries(
            profile.links || {}
        )
            .map(([name, url]) => {
                return `
                    <a
                        href="${esc(safeUrl(url))}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${esc(name)}
                    </a>
                `;
            })
            .join("");

        // Footer
        $("footer").textContent =
            "© " + new Date().getFullYear() +
            " " + profile.name;

        console.log("Portfolio loaded successfully!");

    } catch (error) {

        console.error("Portfolio error:", error);

        $("projects").innerHTML = `
            <p>
                Unable to load portfolio content.
                Please check profile.json.
            </p>
        `;
    }
}

// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadPortfolio
);