// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('autoparts_products') || '[]');
}

// Get categories from localStorage
function getCategories() {
    return JSON.parse(localStorage.getItem('autoparts_categories') || '[]');
}

// Load product details
function loadProductDetails() {
    const products = getProducts();
    const categories = getCategories();
    const product = products.find(p => p.id === productId);
    const detailsContent = document.getElementById('productDetailsContent');
    
    if (!product) {
        detailsContent.innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>Sorry, the product you're looking for doesn't exist.</p>
                <a href="products.html" class="btn-primary">View All Products</a>
            </div>
        `;
        return;
    }
    
    const category = categories.find(c => c.id === product.category);
    
    detailsContent.innerHTML = `
        <div class="product-details-grid">
            <div class="product-details-image">
                ${product.isEmoji ? 
                    `<div class="placeholder-img-large">${product.image}</div>` : 
                    `<img src="${product.image}" alt="${product.name}">`
                }
            </div>
            
            <div class="product-details-info">
                <div class="product-details-header">
                    <span class="product-code-badge-large">${product.code}</span>
                    <span class="product-category-badge">${category ? category.name : 'Unknown Category'}</span>
                </div>
                
                <h1 class="product-details-title">${product.name}</h1>
                
                <div class="product-details-price">${product.price}</div>
                
                ${product.description ? `
                    <div class="product-details-description">
                        <h3>Description</h3>
                        <p>${product.description}</p>
                    </div>
                ` : ''}
                
                <div class="product-details-meta">
                    <div class="meta-item">
                        <span class="meta-label">Product Code:</span>
                        <span class="meta-value">${product.code}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Category:</span>
                        <span class="meta-value">${category ? category.name : 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Availability:</span>
                        <span class="meta-value availability-in-stock">In Stock</span>
                    </div>
                </div>
                
                <div class="product-details-actions">
                    <a href="contact.html" class="btn-contact">Contact for Quote</a>
                    <a href="products.html" class="btn-back">Back to Products</a>
                </div>
            </div>
        </div>
        
        <div class="product-additional-info">
            <div class="info-card">
                <h3>📦 Fast Delivery</h3>
                <p>Quick and reliable delivery service to get your parts when you need them.</p>
            </div>
            <div class="info-card">
                <h3>✓ Quality Guaranteed</h3>
                <p>We source only genuine and high-quality aftermarket parts from trusted manufacturers.</p>
            </div>
            <div class="info-card">
                <h3>🔄 Easy Returns</h3>
                <p>Hassle-free returns and exchanges policy for your peace of mind.</p>
            </div>
            <div class="info-card">
                <h3>💬 Expert Support</h3>
                <p>Our knowledgeable team is ready to help you with any questions.</p>
            </div>
        </div>
    `;
}

// Load product details on page load
if (productId) {
    loadProductDetails();
} else {
    document.getElementById('productDetailsContent').innerHTML = `
        <div class="product-not-found">
            <h2>No Product Selected</h2>
            <p>Please select a product to view its details.</p>
            <a href="products.html" class="btn-primary">View All Products</a>
        </div>
    `;
}
