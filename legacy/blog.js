// Blog functionality with Contentful CMS integration
// Configuration
const CONTENTFUL_CONFIG = {
    space: 'YOUR_SPACE_ID', // Replace with your Contentful Space ID
    accessToken: 'YOUR_ACCESS_TOKEN', // Replace with your Contentful Access Token
    environment: 'master',
    contentType: 'blogPost'
};

// State management
let allPosts = [];
let currentPage = 1;
const postsPerPage = 9;
let currentCategory = 'all';
let searchQuery = '';

// Initialize blog
document.addEventListener('DOMContentLoaded', async () => {
    await loadBlogPosts();
    setupEventListeners();
    handleRouting();
});

// Load blog posts from Contentful
async function loadBlogPosts() {
    try {
        // Check if Contentful is configured
        if (CONTENTFUL_CONFIG.space === 'YOUR_SPACE_ID' || CONTENTFUL_CONFIG.accessToken === 'YOUR_ACCESS_TOKEN') {
            // Use demo data if Contentful is not configured
            allPosts = getDemoPosts();
            renderBlogPosts();
            renderCategories();
            return;
        }

        const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_CONFIG.space}/environments/${CONTENTFUL_CONFIG.environment}/entries?access_token=${CONTENTFUL_CONFIG.accessToken}&content_type=${CONTENTFUL_CONFIG.contentType}&order=-sys.createdAt`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch posts');
        
        const data = await response.json();
        allPosts = await processContentfulData(data);
        
        renderBlogPosts();
        renderCategories();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        // Fallback to demo posts
        allPosts = getDemoPosts();
        renderBlogPosts();
        renderCategories();
    }
}

// Process Contentful data
async function processContentfulData(data) {
    const assets = data.includes?.Asset || [];
    
    return data.items.map(item => {
        const fields = item.fields;
        const featuredImageId = fields.featuredImage?.sys?.id;
        const featuredImage = assets.find(asset => asset.sys.id === featuredImageId);
        
        return {
            id: item.sys.id,
            title: fields.title,
            slug: fields.slug || generateSlug(fields.title),
            excerpt: fields.excerpt || '',
            content: fields.content || '',
            category: fields.category || 'General',
            tags: fields.tags || [],
            featuredImage: featuredImage ? `https:${featuredImage.fields.file.url}` : 'https://via.placeholder.com/800x400?text=Blog+Post',
            author: fields.author || 'Efosa Ojomo',
            publishDate: new Date(item.sys.createdAt),
            readTime: calculateReadTime(fields.content || fields.excerpt || '')
        };
    });
}

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Calculate read time
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

// Render blog posts
function renderBlogPosts() {
    const container = document.getElementById('blog-posts') || document.getElementById('blog-preview');
    if (!container) return;

    let filteredPosts = allPosts;

    // Filter by category
    if (currentCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
            post.category.toLowerCase() === currentCategory.toLowerCase()
        );
    }

    // Filter by search query
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // For homepage preview, show only 3 latest posts
    const isPreview = container.id === 'blog-preview';
    const displayPosts = isPreview ? filteredPosts.slice(0, 3) : paginate(filteredPosts);

    if (displayPosts.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No blog posts found.</p></div>';
        return;
    }

    container.innerHTML = displayPosts.map(post => createBlogCard(post)).join('');

    // Render pagination if not preview
    if (!isPreview) {
        renderPagination(filteredPosts.length);
    }
}

// Create blog card HTML
function createBlogCard(post) {
    const formattedDate = post.publishDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="blog-card">
                <img src="${post.featuredImage}" alt="${post.title}" class="blog-card-img">
                <div class="blog-card-body">
                    <span class="blog-category">${post.category}</span>
                    <h3 class="blog-card-title">
                        <a href="blog.html?post=${post.slug}">${post.title}</a>
                    </h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="far fa-calendar"></i>
                            ${formattedDate}
                        </span>
                        <span class="blog-read-time">
                            <i class="far fa-clock"></i>
                            ${post.readTime}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render categories
function renderCategories() {
    const categoriesContainer = document.getElementById('category-filter');
    if (!categoriesContainer) return;

    const categories = ['all', ...new Set(allPosts.map(post => post.category))];
    
    categoriesContainer.innerHTML = categories.map(category => `
        <button type="button" 
                class="btn btn-outline-primary ${category === currentCategory ? 'active' : ''}" 
                data-category="${category}">
            ${category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
    `).join('');
}

// Pagination
function paginate(posts) {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return posts.slice(startIndex, endIndex);
}

function renderPagination(totalPosts) {
    const paginationContainer = document.getElementById('blog-pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalPosts / postsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Render single post
function renderSinglePost(slug) {
    const post = allPosts.find(p => p.slug === slug);
    
    if (!post) {
        window.location.href = 'blog.html';
        return;
    }

    const listView = document.getElementById('blog-list-view');
    const postView = document.getElementById('blog-post-view');
    
    if (listView) listView.style.display = 'none';
    if (postView) postView.style.display = 'block';

    const contentContainer = document.getElementById('blog-post-content');
    if (!contentContainer) return;

    const formattedDate = post.publishDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    contentContainer.innerHTML = `
        <div class="blog-post-header">
            <h1 class="blog-post-title">${post.title}</h1>
            <div class="blog-meta mb-3">
                <span class="blog-date me-4">
                    <i class="far fa-calendar"></i>
                    ${formattedDate}
                </span>
                <span class="blog-read-time me-4">
                    <i class="far fa-clock"></i>
                    ${post.readTime}
                </span>
                <span class="blog-category">${post.category}</span>
            </div>
        </div>
        
        <img src="${post.featuredImage}" alt="${post.title}" class="blog-post-featured-image">
        
        <div class="blog-post-content">
            ${formatContent(post.content)}
        </div>
        
        ${post.tags && post.tags.length > 0 ? `
            <div class="blog-tags">
                <h5 class="mb-3">Tags</h5>
                ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
    `;

    // Render related posts
    renderRelatedPosts(post);

    // Update page title and meta
    document.title = `${post.title} - Efosa Ojomo Blog`;
}

// Format markdown-style content
function formatContent(content) {
    // Basic markdown-like formatting
    return content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>');
}

// Render related posts
function renderRelatedPosts(currentPost) {
    const relatedContainer = document.getElementById('related-posts');
    if (!relatedContainer) return;

    const related = allPosts
        .filter(post => 
            post.id !== currentPost.id && 
            (post.category === currentPost.category || 
             post.tags.some(tag => currentPost.tags.includes(tag)))
        )
        .slice(0, 3);

    if (related.length === 0) {
        relatedContainer.innerHTML = '<p class="text-muted">No related posts found.</p>';
        return;
    }

    relatedContainer.innerHTML = related.map(post => createBlogCard(post)).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-category]')) {
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            renderBlogPosts();
            renderCategories();
        }
    });

    // Pagination
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-page]')) {
            e.preventDefault();
            const page = parseInt(e.target.dataset.page);
            if (page >= 1) {
                currentPage = page;
                renderBlogPosts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    // Search
    const searchInput = document.getElementById('blog-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            searchQuery = searchInput.value;
            currentPage = 1;
            renderBlogPosts();
        }, 300));
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchQuery = searchInput.value;
            currentPage = 1;
            renderBlogPosts();
        });
    }
}

// Handle routing
function handleRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    
    if (postSlug) {
        renderSinglePost(postSlug);
    }
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Demo posts (fallback when Contentful is not configured)
function getDemoPosts() {
    return [
        {
            id: 'demo-1',
            title: 'Designing Agentic AI Workflows for Enterprise Teams',
            slug: 'designing-agentic-ai-workflows-enterprise-teams',
            excerpt: 'A practical framework for turning LLM capabilities into governed, multi-step enterprise workflows with real business value.',
            content: `Agentic AI becomes useful in enterprise settings when it is designed as a workflow system, not just a chatbot.\n\n## Start With the Job To Be Done\n\nThe right entry point is the operational workflow: what steps are repetitive, what context is required, and where a human must stay in control.\n\n## Product Decisions That Matter\n\n- Define where retrieval is needed versus where deterministic logic is safer\n- Decide what the agent can do autonomously and what requires approval\n- Design clear fallback paths when confidence is low\n- Instrument the experience so you can measure adoption, completion, and trust\n\n## Enterprise Requirements\n\nAgentic systems need auditability, tenant-aware controls, and responsible AI guardrails. The product question is not just whether the model can do a task, but whether the workflow is safe, measurable, and commercially valuable.\n\nThe best AI product strategy turns technical capability into repeatable business outcomes.`,
            category: 'AI Product',
            tags: ['Agentic AI', 'LLM', 'Enterprise SaaS', 'Workflow Design'],
            featuredImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
            author: 'Efosa Ojomo',
            publishDate: new Date('2025-01-18'),
            readTime: '8 min read'
        },
        {
            id: 'demo-2',
            title: 'How To Write PRDs for AI Products That Engineering Can Actually Build',
            slug: 'write-prds-for-ai-products-engineering-can-build',
            excerpt: 'PRDs for AI systems need more than feature requests. They need clear workflows, evaluation logic, and decision boundaries.',
            content: `AI product requirements break down when they stop at "add AI" and never define the workflow, inputs, outputs, and failure handling.\n\n## What an AI PRD Must Clarify\n\n- The user problem and why AI is the right mechanism\n- The sources of context, retrieval, and system constraints\n- What success looks like for quality, latency, and usability\n- What happens when the model is uncertain or wrong\n- How the feature will be evaluated before and after launch\n\n## Translate Capability Into Product Scope\n\nA strong AI PRD frames the user experience, the data dependencies, the guardrails, and the tradeoffs between accuracy, speed, and cost.\n\n## Make Evaluation Part of the Requirement\n\nIf you cannot explain how a feature will be tested, benchmarked, and observed in production, the requirement is not ready.\n\nThe best AI product documents create alignment between product, design, engineering, and leadership before implementation starts.`,
            category: 'Product Management',
            tags: ['PRDs', 'AI Product Strategy', 'Requirements', 'Cross-Functional Alignment'],
            featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
            author: 'Efosa Ojomo',
            publishDate: new Date('2025-01-10'),
            readTime: '7 min read'
        },
        {
            id: 'demo-3',
            title: 'Closing the Voice-of-Customer Loop in Enterprise Platform Products',
            slug: 'closing-voice-of-customer-loop-enterprise-platform-products',
            excerpt: 'Enterprise platform teams win when customer feedback becomes a disciplined input to roadmap prioritization, not just support noise.',
            content: `Enterprise customers tell you what is painful, but product teams still need a system for turning that signal into product decisions.\n\n## Separate Noise From Pattern\n\nThe most useful feedback loops connect support issues, sales conversations, customer health indicators, and delivery constraints into one prioritization view.\n\n## Product Management Questions To Ask\n\n- Is this a one-off account request or a repeatable platform need?\n- Does solving it improve retention, adoption, or operational efficiency?\n- What is the product cost of not addressing it?\n- What do executive stakeholders need to understand about the tradeoff?\n\n## Close the Loop Publicly\n\nCustomer feedback becomes valuable when it is visible in roadmap discussions and reflected back to stakeholders as progress, rationale, and outcome.\n\nVoice-of-customer is strongest when it improves both product judgment and organizational trust.`,
            category: 'Enterprise SaaS',
            tags: ['Voice of Customer', 'Enterprise Accounts', 'Roadmap Prioritization', 'Retention'],
            featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
            author: 'Efosa Ojomo',
            publishDate: new Date('2025-01-04'),
            readTime: '9 min read'
        },
        {
            id: 'demo-4',
            title: 'Bridging Engineering, Product, and Business Outcomes as a Technical PM',
            slug: 'bridging-engineering-product-business-outcomes',
            excerpt: 'Technical fluency matters most when it improves prioritization, stakeholder alignment, and executive decision-making.',
            content: `Technical Product Managers create leverage by translating between disciplines without flattening the complexity.\n\n## Technical Depth Is Not the Goal\n\nTechnical credibility matters because it helps you ask sharper questions, challenge weak assumptions, and make better tradeoffs. It is valuable only if it improves outcomes.\n\n## The Real TPM Leverage Points\n\n- Clarifying requirements before they become delivery risk\n- Framing platform work in business terms leadership can act on\n- Translating customer needs into engineering-ready priorities\n- Turning technical constraints into product decisions instead of surprises\n\n## Executive Communication Matters\n\nA TPM needs to tell a clear story: what problem matters, why now, what the options are, what the tradeoffs are, and what success will look like.\n\nThat bridge between engineering, product, and business is where strong technical product leadership compounds.`,
            category: 'Technical PM',
            tags: ['Technical Product Management', 'Stakeholder Alignment', 'Executive Communication', 'Roadmaps'],
            featuredImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=400&fit=crop',
            author: 'Efosa Ojomo',
            publishDate: new Date('2024-12-28'),
            readTime: '7 min read'
        },
        {
            id: 'demo-5',
            title: 'Pricing and Packaging an Enterprise AI SaaS Product',
            slug: 'pricing-and-packaging-enterprise-ai-saas-product',
            excerpt: 'AI product strategy is incomplete without pricing logic, customer segmentation, and a credible enterprise narrative.',
            content: `Product strategy does not stop at the feature roadmap. For enterprise AI products, packaging and pricing shape how the market understands value.\n\n## Start With Customer Segmentation\n\nDifferent customers buy for different reasons. Starter, Pro, and Enterprise tiers should reflect differences in workflow complexity, governance needs, service expectations, and ROI potential.\n\n## Tie Packaging to Outcomes\n\nThe strongest packaging model connects features to business outcomes such as automation, faster resolution, better insights, or lower operating cost.\n\n## Build for Enterprise Trust\n\nEnterprise buyers also care about onboarding, SLAs, tenant controls, security posture, and support models. These are product decisions, not just sales collateral.\n\nGood pricing strategy helps the product tell a commercial story before the first sales call is over.`,
            category: 'AI Product',
            tags: ['Pricing Strategy', 'Enterprise SaaS', 'Go-To-Market', 'Product Positioning'],
            featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
            author: 'Efosa Ojomo',
            publishDate: new Date('2024-12-20'),
            readTime: '6 min read'
        },
        {
            id: 'demo-6',
            title: 'The Product Metrics That Matter for Cloud and Platform Teams',
            slug: 'product-metrics-that-matter-cloud-platform-teams',
            excerpt: 'Cloud and platform products need a balanced scorecard that ties reliability and delivery data to customer and business outcomes.',
            content: `Platform teams often track deep operational metrics but struggle to connect them to product outcomes.\n\n## Start With Outcome Categories\n\nA useful platform metric set usually covers four areas:\n\n- Customer adoption and account health\n- Delivery speed and release confidence\n- Reliability and SLA protection\n- Commercial or operational value created\n\n## Avoid Metric Silos\n\nDeployment speed matters, but only in context. A faster release process is meaningful if it improves time-to-value, reduces escalations, or helps retain customers.\n\n## Make Metrics Actionable\n\nProduct metrics should help leadership decide what to prioritize next, what risk is rising, and where the product is creating value.\n\nWhen cloud and platform metrics are tied to business outcomes, platform work becomes easier to defend, fund, and scale.`,
            category: 'Platform Products',
            tags: ['Product Metrics', 'SLA', 'Enterprise SaaS', 'Platform Strategy'],
            featuredImage: 'https://images.unsplash.com/photo-1605745341075-48ba1e3a536a?w=800&h=400&fit=crop',
            author: 'Efosa Ojomo',
            publishDate: new Date('2024-12-12'),
            readTime: '6 min read'
        }
    ];
}

// Export for use in main script.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadBlogPosts, renderBlogPosts };
}
