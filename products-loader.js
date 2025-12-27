// Load products dynamically on the products page
const CATEGORIES_KEY = 'autoparts_categories';
const PRODUCTS_KEY = 'autoparts_products';

// Get categories
function getCategories() {
    return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
}

// Get products
function getProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
}

// Load filter buttons
function loadFilterButtons() {
    const categories = getCategories();
    const filterButtons = document.querySelector('.filter-buttons');
    
    if (filterButtons && categories.length > 0) {
        filterButtons.innerHTML = `
            <button class="filter-btn active" data-category="all">All Products</button>
            ${categories.map(cat => 
                `<button class="filter-btn" data-category="${cat.id}">${cat.name}</button>`
            ).join('')}
        `;
        
        // Reattach filter functionality
        attachFilterListeners();
    }
}

// Load products
function loadProducts(filteredProducts = null) {
    const products = filteredProducts || getProducts();
    const categories = getCategories();
    const productsContainer = document.getElementById('productsContainer');
    
    if (productsContainer) {
        if (products.length === 0) {
            productsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">No products available yet</h3>
                    <p style="color: #666;">Visit the <a href="admin.html" style="color: var(--secondary-color); font-weight: bold;">Admin Panel</a> to add products.</p>
                </div>
            `;
            return;
        }
        
        productsContainer.innerHTML = products.map(product => {
            const category = categories.find(c => c.id === product.category);
            return `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-image">
                        ${product.isEmoji ? 
                            `<div class="placeholder-img">${product.image}</div>` : 
                            `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`
                        }
                    </div>
                    <div class="product-info">
                        <span class="product-code-badge">${product.code}</span>
                        <span class="product-category">${category ? category.name : 'Unknown'}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">${product.price}</div>
                        <button class="buy-button" onclick="viewProductDetails('${product.id}')">View Details</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Reattach buy button listeners
        attachBuyButtonListeners();
    }
}

// Attach filter listeners
function attachFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Attach buy button listeners
function attachBuyButtonListeners() {
    document.querySelectorAll('.buy-button').forEach(button => {
        if (!button.hasAttribute('onclick')) {
            button.addEventListener('click', () => {
                const productName = button.closest('.product-card').querySelector('h3').textContent;
                alert(`Interested in ${productName}? Contact us for more details and pricing!`);
            });
        }
    });
}

// View product details
function viewProductDetails(productId) {
    // Redirect to product details page
    window.location.href = `product-details.html?id=${productId}`;
}

// Search functionality
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchQuery = searchInput.value.trim().toUpperCase();
    
    if (!searchQuery) {
        searchResults.innerHTML = '<p class="search-message">Please enter a product code to search.</p>';
        return;
    }
    
    const products = getProducts();
    const foundProducts = products.filter(product => 
        product.code.toUpperCase().includes(searchQuery)
    );
    
    if (foundProducts.length === 0) {
        searchResults.innerHTML = `<p class="search-message error">No products found with code "${searchQuery}"</p>`;
        loadProducts(); // Show all products
    } else {
        searchResults.innerHTML = `<p class="search-message success">Found ${foundProducts.length} product(s) matching "${searchQuery}"</p>`;
        loadProducts(foundProducts); // Show only matching products
        
        // Scroll to products
        document.getElementById('productsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.value = '';
    searchResults.innerHTML = '';
    loadProducts(); // Show all products
}

// Initialize on page load
if (document.getElementById('productsContainer')) {
    loadFilterButtons();
    
    // Check if there's a category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    
    if (categoryFilter) {
        // Filter products by category from URL
        const products = getProducts();
        const filteredProducts = products.filter(p => p.category === categoryFilter);
        loadProducts(filteredProducts);
    } else {
        loadProducts();
    }
    
    // Attach search event listeners
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchProducts);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
