const projects = [
    {
        id: "data-clinch",
        title: "Data Clinch",
        subtitle: "Co-Founder & AI Product Lead",
        description: "Co-founded ClinchDesk, a multi-tenant AI-powered SaaS platform, and owned the product lifecycle from customer discovery and problem definition through roadmap prioritization, AI strategy, and enterprise go-to-market execution.",
        image: "projects/images/tech6.jpg",
        technologies: ["Agentic AI", "LLM Integration", "PRDs", "Pricing Strategy", "Enterprise GTM"],
        tenure: "Dec 2025 - Present",
        workMode: "Los Angeles, CA",
        focus: "AI product strategy, roadmap ownership, and enterprise positioning"
    },
    {
        id: "vertex",
        title: "Vertex Inc.",
        subtitle: "Technical Product Manager (Technical Product Specialist)",
        description: "Lead enterprise solution strategy and technical product alignment across ERP, cloud, and integration initiatives for a platform serving 500+ enterprise accounts and 1M+ daily transactions.",
        image: "projects/images/tech5.jpg",
        technologies: ["ERP Integrations", "Voice of Customer", "Roadmap Alignment", "Executive Stakeholders", "Microservices"],
        tenure: "Jun 2024 - Present",
        workMode: "Remote",
        focus: "Enterprise TPM leadership, requirements definition, and product narrative translation"
    },
    {
        id: "microsoft",
        title: "Microsoft (via LTIMindtree)",
        subtitle: "Technical Product Manager - Azure",
        description: "Served as technical product authority across 100+ enterprise accounts on an Azure platform processing 5M+ daily requests at 99.95% SLA, shaping platform strategy and stakeholder communication across 8 major releases.",
        image: "projects/images/tech4.jpg",
        technologies: ["Azure Platform", "Enterprise Accounts", "Release Strategy", "Retention", "Stakeholder Communication"],
        tenure: "Sep 2022 - Jun 2024",
        workMode: "Hybrid",
        focus: "Platform product strategy, release planning, and enterprise adoption"
    },
    {
        id: "amazon",
        title: "Amazon",
        subtitle: "Technical Product Manager (Technical Product Specialist)",
        description: "Supported cloud product release readiness, cross-functional delivery coordination, and technical quality reviews for cloud-based platform initiatives at Amazon.",
        image: "projects/images/tech3.jpg",
        technologies: ["Cloud Releases", "Cross-Functional Delivery", "SLOs", "Agile Metrics", "AWS Patterns"],
        tenure: "May 2022 - Sep 2022",
        workMode: "Hybrid",
        focus: "Release readiness, dependency management, and reliability standards"
    },
    {
        id: "mind-machine",
        title: "Mind Machine",
        subtitle: "Software Engineer & Product Specialist",
        description: "Supported cloud software development across the full product lifecycle, translating user and business requirements into scalable solutions aligned to product goals and release quality standards.",
        image: "projects/images/tech2.jpg",
        technologies: ["Requirements Analysis", "Product Lifecycle", "Release Readiness", "Quality Validation", "Cloud Software"],
        tenure: "Oct 2020 - Oct 2021",
        workMode: "Remote",
        focus: "Requirements translation, solution design, and release accountability"
    },
    {
        id: "smarter-grid",
        title: "Smarter Grid International",
        subtitle: "Software Engineer & Cloud Architect",
        description: "Architected an IoT data processing platform handling 50M+ daily sensor readings at 99.9% reliability, while leading end-to-end software product delivery across web application projects.",
        image: "projects/images/tech8.jpg",
        technologies: ["IoT Platform", "Backlog Prioritization", "CI/CD", "Stakeholder Communication", "Reliability"],
        tenure: "Oct 2018 - Oct 2020",
        workMode: "Onsite",
        focus: "Full-lifecycle product delivery across cloud and IoT systems"
    }
];

const projectDetails = {
    "data-clinch": {
        title: "Data Clinch",
        fullDescription: `
            <h4>Role</h4>
            <p><strong>Co-Founder &amp; AI Product Lead</strong></p>
            <ul>
                <li>Co-founded ClinchDesk, a multi-tenant AI-powered SaaS platform, owning the full product lifecycle from customer discovery and problem definition through roadmap prioritization, AI product strategy, and enterprise go-to-market execution.</li>
                <li>Defined product vision, ICP, customer problem statements, and multi-tier pricing architecture, translating market research and customer insight into product requirements and commercial positioning.</li>
                <li>Shaped AI product strategy across agentic AI workflows, LLM integration with Anthropic Claude and OpenAI, intelligent automation, and AI-assisted decision experiences.</li>
                <li>Authored PRDs, product roadmaps, and AI feature specifications, prioritizing backlog based on customer impact, feasibility, and strategic alignment.</li>
                <li>Drove enterprise readiness through multi-tenant architecture, SLA commitments, onboarding frameworks, and customer health scoring.</li>
                <li>Created product narratives, stakeholder updates, investor-facing explanations, and technical-business positioning for technical and non-technical audiences.</li>
            </ul>
        `,
        technologies: ["Agentic AI", "Anthropic Claude", "OpenAI", "PRDs", "Pricing Architecture", "Enterprise GTM"],
        tenure: "Dec 2025 - Present",
        workMode: "Los Angeles, CA",
        focus: "AI product strategy, roadmap leadership, and product-market positioning",
        results: {
            productScope: "Multi-tenant AI SaaS platform",
            aiStrategy: "Agentic workflows and LLM integration",
            pricingModel: "Starter / Pro / Enterprise",
            audience: "Investors and enterprise prospects"
        }
    },
    vertex: {
        title: "Vertex Inc.",
        fullDescription: `
            <h4>Role</h4>
            <p><strong>Technical Product Manager (Technical Product Specialist)</strong></p>
            <ul>
                <li>Lead enterprise solution strategy and technical product alignment for complex ERP, cloud, and integration initiatives across a platform serving 500+ enterprise accounts at 1M+ daily transactions.</li>
                <li>Partner with stakeholders, engineering teams, and business leaders to define requirements, clarify solution scope, evaluate delivery tradeoffs, and connect platform capabilities to business outcomes.</li>
                <li>Led ERP integration strategy connecting 15+ SAP systems through Java-based microservices, enabling reliable data exchange across mission-critical workflows.</li>
                <li>Operated as voice-of-customer by aggregating enterprise feedback, influencing product backlog prioritization, and communicating roadmap progress to executive leadership.</li>
                <li>Improved platform reliability and delivery confidence by supporting CI/CD, observability, database architecture, and incident response improvements.</li>
                <li>Translated complex cloud, data, and platform architecture topics into clear product narratives, adoption guidance, and executive-ready summaries.</li>
            </ul>
        `,
        technologies: ["ERP Strategy", "SAP Integration", "Voice of Customer", "Executive Communication", "Backlog Prioritization"],
        tenure: "Jun 2024 - Present",
        workMode: "Remote",
        focus: "Requirements definition, enterprise TPM leadership, and product-business alignment",
        results: {
            enterpriseAccounts: "500+",
            dailyTransactions: "1M+",
            integrationsLed: "15+ SAP systems",
            businessValue: "$10M+ workflow value"
        }
    },
    microsoft: {
        title: "Microsoft (via LTIMindtree)",
        fullDescription: `
            <h4>Role</h4>
            <p><strong>Technical Product Manager - Azure (Technical Product Specialist)</strong></p>
            <ul>
                <li>Served as technical product authority across 100+ enterprise accounts on Azure platform processing 5M+ daily requests at 99.95% SLA.</li>
                <li>Led technical product discovery, solution planning, and platform adoption discussions to align Azure capabilities with customer needs, business goals, and product outcomes.</li>
                <li>Reduced client escalations by 35% and improved retention by 25% by aligning platform product decisions to enterprise business outcomes and presenting roadmap value to C-suite stakeholders.</li>
                <li>Led a cross-functional team of 10 engineers across three time zones, prioritizing platform improvements, managing delivery risks, and maintaining stakeholder alignment.</li>
                <li>Closed the product feedback loop across 100+ enterprise accounts, translating client requirements into engineering roadmap priorities and communicating delivery outcomes to executive leadership.</li>
            </ul>
        `,
        technologies: ["Azure Platform", "Platform Adoption", "Release Strategy", "Retention", "Executive Stakeholders"],
        tenure: "Sep 2022 - Jun 2024",
        workMode: "Hybrid",
        focus: "Platform product strategy, stakeholder communication, and roadmap prioritization",
        results: {
            enterpriseClients: "100+",
            dailyRequests: "5M+",
            sla: "99.95%",
            majorReleases: "8",
            escalationReduction: "35%",
            retentionIncrease: "25%",
            teamLeadership: "10 engineers"
        }
    },
    amazon: {
        title: "Amazon",
        fullDescription: `
            <h4>Role</h4>
            <p><strong>Technical Product Manager (Technical Product Specialist)</strong></p>
            <ul>
                <li>Supported cloud product release readiness, cross-functional delivery coordination, and technical quality reviews for cloud-based platform initiatives.</li>
                <li>Coordinated across backend, frontend, and middle-tier teams to support cloud product delivery, integration readiness, sprint visibility, and on-time release execution.</li>
                <li>Managed dependency tracking, impediment resolution, and Agile metrics to improve product delivery transparency and reduce production risk.</li>
                <li>Partnered with SRE leadership to define SLOs and enterprise reliability standards adopted across the wider engineering organization.</li>
                <li>Advised on AWS patterns contributing to approximately 35% infrastructure cost reduction.</li>
            </ul>
        `,
        technologies: ["Release Readiness", "Cross-Functional Delivery", "SLOs", "Agile Metrics", "AWS Patterns"],
        tenure: "May 2022 - Sep 2022",
        workMode: "Hybrid",
        focus: "Cloud product delivery, release coordination, and reliability standards",
        results: {
            releaseReadiness: "Cloud platform initiatives",
            coordination: "Backend, frontend, and middle-tier teams",
            costReduction: "35%",
            standards: "SLO and reliability frameworks"
        }
    },
    "mind-machine": {
        title: "Mind Machine",
        fullDescription: `
            <h4>Role</h4>
            <p><strong>Software Engineer &amp; Product Specialist</strong></p>
            <ul>
                <li>Contributed to cloud software development and deployment across the full product lifecycle, supporting solution design, release readiness, and product delivery execution.</li>
                <li>Analyzed user and business requirements and translated them into scalable software solutions aligned to product goals, user experience objectives, and quality standards.</li>
                <li>Supported product testing and validation in real-world conditions to ensure solutions met performance, reliability, and usability standards before release.</li>
                <li>Maintained delivery accountability across engineering and product stakeholders.</li>
            </ul>
        `,
        technologies: ["Requirements Analysis", "Release Readiness", "Product Delivery", "Quality Validation", "Cloud Software"],
        tenure: "Oct 2020 - Oct 2021",
        workMode: "Remote",
        focus: "Requirements translation, full-lifecycle delivery, and product quality",
        results: {
            lifecycle: "Full product lifecycle support",
            emphasis: "Business requirements to scalable solutions",
            quality: "Performance, reliability, and usability validation"
        }
    },
    "smarter-grid": {
        title: "Smarter Grid International",
        fullDescription: `
            <h4>Role</h4>
            <p><strong>Software Engineer &amp; Cloud Architect</strong></p>
            <ul>
                <li>Architected an IoT data processing platform handling 50M+ daily sensor readings at 99.9% reliability for enterprise energy clients.</li>
                <li>Led end-to-end software product delivery from backlog prioritization through deployment, managing the full development lifecycle across web application projects.</li>
                <li>Championed CI/CD implementation and operational efficiency improvements, reducing downtime and enabling rapid, reliable product releases across development, staging, and production environments.</li>
                <li>Facilitated cross-functional stakeholder communication, translating technical challenges into business-aligned solutions and ensuring delivery timelines aligned with product vision.</li>
            </ul>
        `,
        technologies: ["IoT Platform", "Backlog Prioritization", "CI/CD", "Stakeholder Communication", "Product Delivery"],
        tenure: "Oct 2018 - Oct 2020",
        workMode: "Onsite",
        focus: "IoT product delivery, backlog ownership, and release reliability",
        results: {
            dailySensorReadings: "50M+",
            reliability: "99.9%",
            deliveryScope: "End-to-end software product lifecycle",
            enablement: "CI/CD across dev, staging, and production"
        }
    }
};

function openProjectModal(projectId) {
    const project = projectDetails[projectId];
    if (!project) {
        console.error("Project not found:", projectId);
        return;
    }

    if (!document.getElementById("projectModal")) {
        createProjectModal();
    }

    document.getElementById("projectModalTitle").textContent = project.title;
    document.getElementById("projectModalBody").innerHTML = project.fullDescription;
    document.getElementById("projectModalTechnologies").innerHTML = project.technologies
        .map((tech) => `<span class="badge bg-primary me-1 mb-1">${tech}</span>`)
        .join("");

    document.getElementById("projectDuration").textContent = project.tenure;
    document.getElementById("projectTeamSize").textContent = project.workMode;
    document.getElementById("projectRole").textContent = project.focus;

    const resultsContainer = document.getElementById("projectResults");
    resultsContainer.innerHTML = "";
    Object.entries(project.results).forEach(([key, value]) => {
        const resultItem = document.createElement("div");
        resultItem.className = "col-md-6 mb-2";
        resultItem.innerHTML = `<strong>${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong> ${value}`;
        resultsContainer.appendChild(resultItem);
    });

    const modalElement = new bootstrap.Modal(document.getElementById("projectModal"));
    modalElement.show();
}

function createProjectModal() {
    const modalHTML = `
        <div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content" style="background: var(--card-bg); color: var(--text-light); border: 1px solid rgba(0, 212, 255, 0.2);">
                    <div class="modal-header" style="border-bottom: 1px solid rgba(0, 212, 255, 0.2);">
                        <h5 class="modal-title" id="projectModalTitle" style="color: var(--primary-color); font-weight: 700;"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="filter: invert(1);"></button>
                    </div>
                    <div class="modal-body">
                        <div id="projectModalBody"></div>

                        <div class="row mt-4">
                            <div class="col-md-4">
                                <h6 style="color: var(--primary-color);">Tenure</h6>
                                <p id="projectDuration"></p>
                            </div>
                            <div class="col-md-4">
                                <h6 style="color: var(--primary-color);">Work Mode</h6>
                                <p id="projectTeamSize"></p>
                            </div>
                            <div class="col-md-4">
                                <h6 style="color: var(--primary-color);">Focus</h6>
                                <p id="projectRole"></p>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h6 style="color: var(--primary-color);">Keywords</h6>
                            <div id="projectModalTechnologies"></div>
                        </div>

                        <div class="mt-4">
                            <h6 style="color: var(--primary-color);">Highlights</h6>
                            <div class="row" id="projectResults"></div>
                        </div>
                    </div>
                    <div class="modal-footer" style="border-top: 1px solid rgba(0, 212, 255, 0.2);">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="window.open('https://www.linkedin.com/in/efosa-o-4882a015a/', '_blank')">
                            <i class="fab fa-linkedin me-2"></i>Connect on LinkedIn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("current-year").textContent = new Date().getFullYear();

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".skill-category, .project-card, .impact-card, #about p").forEach((el) => {
        el.classList.add("fade-in");
        observer.observe(el);
    });

    const projectList = document.getElementById("project-list");
    if (projectList) {
        projects.forEach((project) => {
            const projectCard = document.createElement("div");
            projectCard.className = "col-lg-4 col-md-6 mb-4";

            const techBadges = project.technologies
                .map((tech) => `<span class="badge bg-primary me-1 mb-1">${tech}</span>`)
                .join("");

            projectCard.innerHTML = `
                <div class="card project-card h-100" data-project-id="${project.id}">
                    <img src="${project.image}" class="card-img-top" alt="${project.title}" onerror="this.src='projects/images/tech9.jpg'">
                    <div class="card-body d-flex flex-column">
                        <p class="experience-role">${project.subtitle}</p>
                        <h5 class="card-title">${project.title}</h5>
                        <p class="experience-meta">${project.tenure} | ${project.workMode}</p>
                        <p class="card-text flex-grow-1">${project.description}</p>
                        <div class="mb-3">
                            ${techBadges}
                        </div>
                        <button class="btn btn-primary mt-auto" onclick="openProjectModal('${project.id}')">
                            <i class="fas fa-info-circle me-2"></i>View Highlights
                        </button>
                    </div>
                </div>
            `;
            projectList.appendChild(projectCard);
        });
    }

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
            if (isLocalPreview) {
                e.preventDefault();
                window.location.href = "thank-you.html";
                return;
            }
            return true;
        });
    }

    if (document.getElementById("blog-preview")) {
        loadBlogPreview();
    }
});

async function loadBlogPreview() {
    const script = document.createElement("script");
    script.src = "blog.js";
    document.body.appendChild(script);
}
