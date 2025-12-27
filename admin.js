// Storage keys
const CATEGORIES_KEY = 'autoparts_categories';
const PRODUCTS_KEY = 'autoparts_products';

// Initialize default data if not exists
function initializeData() {
    if (!localStorage.getItem(CATEGORIES_KEY)) {
        const defaultCategories = [
            { id: 'engine', name: 'Engine Parts' },
            { id: 'brakes', name: 'Brake Systems' },
            { id: 'electrical', name: 'Electrical' },
            { id: 'suspension', name: 'Suspension' },
            { id: 'body', name: 'Body Parts' }
        ];
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem(PRODUCTS_KEY)) {
        const defaultProducts = [
            {
                id: '1',
                code: 'ENG-001',
                name: 'Engine Oil Filters',
                description: 'Premium quality oil filters for all vehicle types. Ensures clean oil circulation and engine protection.',
                price: 'AED 12.99 - AED 29.99',
                category: 'engine',
                image: '🔩',
                isEmoji: true
            },
            {
                id: '2',
                code: 'BRK-001',
                name: 'Brake Pads',
                description: 'Premium brake pads for superior stopping power. Low dust formula for cleaner wheels.',
                price: 'AED 49.99 - AED 89.99',
                category: 'brakes',
                image: '🛞',
                isEmoji: true
            },
            {
                id: '3',
                code: 'ELC-001',
                name: 'LED Headlights',
                description: 'Bright LED headlight bulbs. Energy-efficient with longer lifespan than halogen.',
                price: 'AED 39.99 - AED 89.99',
                category: 'electrical',
                image: '💡',
                isEmoji: true
            }
        ];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    }
}

// Get categories
function getCategories() {
    return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
}

// Get products
function getProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
}

// Save categories
function saveCategories(categories) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// Save products
function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Display categories
function displayCategories() {
    const categories = getCategories();
    const categoriesList = document.getElementById('categoriesList');
    const categorySelect = document.getElementById('productCategory');
    
    if (categoriesList) {
        categoriesList.innerHTML = categories.map(cat => `
            <div class="category-item">
                <span>${cat.name}</span>
                <div class="category-actions">
                    <button class="btn-edit" onclick="editCategory('${cat.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteCategory('${cat.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Select a category</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }
}

// Display products
function displayProducts() {
    const products = getProducts();
    const categories = getCategories();
    const productsList = document.getElementById('productsList');
    
    if (productsList) {
        productsList.innerHTML = products.map(product => {
            const category = categories.find(c => c.id === product.category);
            return `
                <div class="admin-product-card">
                    <div class="admin-product-image">
                        ${product.isEmoji ? 
                            `<div class="placeholder-img">${product.image}</div>` : 
                            `<img src="${product.image}" alt="${product.name}">`
                        }
                    </div>
                    <div class="admin-product-info">
                        <span class="product-code-badge">${product.code}</span>
                        <span class="product-category">${category ? category.name : 'Unknown'}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">${product.price}</div>
                    </div>
                    <div class="admin-product-actions">
                        <button class="btn-edit-product" onclick="editProduct('${product.id}')">Edit</button>
                        <button class="btn-delete-product" onclick="deleteProduct('${product.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Add category
document.getElementById('categoryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const categoryName = document.getElementById('categoryName').value.trim();
    if (!categoryName) return;
    
    const categories = getCategories();
    const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if category already exists
    if (categories.some(cat => cat.id === categoryId)) {
        alert('This category already exists!');
        return;
    }
    
    categories.push({
        id: categoryId,
        name: categoryName
    });
    
    saveCategories(categories);
    displayCategories();
    
    // Update footer categories
    if (typeof loadFooterCategories === 'function') {
        loadFooterCategories();
    }
    
    this.reset();
    alert('Category added successfully!');
});

// Add product
document.getElementById('productForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const code = document.getElementById('productCode').value.trim();
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    let price = document.getElementById('productPrice').value.trim();
    const category = document.getElementById('productCategory').value;
    const imageFile = document.getElementById('productImage').files[0];
    const emoji = document.getElementById('productEmoji').value.trim();
    
    if (!code || !name || !price || !category) {
        alert('Please fill in all required fields!');
        return;
    }
    
    // Automatically add AED currency if not already present
    if (!price.toUpperCase().includes('AED')) {
        // Check if it's a range (contains hyphen)
        if (price.includes('-')) {
            const parts = price.split('-').map(p => p.trim());
            price = `AED ${parts[0]} - AED ${parts[1]}`;
        } else {
            price = `AED ${price}`;
        }
    }
    
    const products = getProducts();
    
    // Check if product code already exists
    if (products.some(prod => prod.code === code)) {
        alert('A product with this code already exists! Please use a unique product code.');
        return;
    }
    
    const productId = Date.now().toString();
    
    const newProduct = {
        id: productId,
        code: code,
        name: name,
        description: description,
        price: price,
        category: category
    };
    
    // Handle image/emoji
    if (emoji) {
        newProduct.image = emoji;
        newProduct.isEmoji = true;
        addProductToList(newProduct);
    } else if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newProduct.image = event.target.result;
            newProduct.isEmoji = false;
            addProductToList(newProduct);
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert('Please provide either an image or an emoji!');
        return;
    }
    
    function addProductToList(product) {
        products.push(product);
        saveProducts(products);
        displayProducts();
        document.getElementById('productForm').reset();
        alert('Product added successfully!');
    }
});

// Delete category
function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category? Products in this category will remain but will show as "Unknown".')) {
        return;
    }
    
    const categories = getCategories();
    const filtered = categories.filter(cat => cat.id !== categoryId);
    saveCategories(filtered);
    displayCategories();
    displayProducts();
    
    // Update footer categories
    if (typeof loadFooterCategories === 'function') {
        loadFooterCategories();
    }
}

// Edit category
function editCategory(categoryId) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) {
        alert('Category not found!');
        return;
    }
    
    const newName = prompt('Edit category name:', category.name);
    
    if (newName && newName.trim() !== '') {
        const trimmedName = newName.trim();
        const newId = trimmedName.toLowerCase().replace(/\s+/g, '-');
        
        // Check if new name already exists (excluding current category)
        if (categories.some(cat => cat.id === newId && cat.id !== categoryId)) {
            alert('A category with this name already exists!');
            return;
        }
        
        // Update category
        category.name = trimmedName;
        category.id = newId;
        
        // Update products that use this category
        const products = getProducts();
        products.forEach(product => {
            if (product.category === categoryId) {
                product.category = newId;
            }
        });
        
        saveCategories(categories);
        saveProducts(products);
        displayCategories();
        displayProducts();
        
        // Update footer categories
        if (typeof loadFooterCategories === 'function') {
            loadFooterCategories();
        }
        
        alert('Category updated successfully!');
    }
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const products = getProducts();
    const filtered = products.filter(prod => prod.id !== productId);
    saveProducts(filtered);
    displayProducts();
}

// Edit product
function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    // Populate form with product data
    document.getElementById('productCode').value = product.code;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    
    // Remove AED prefix for editing
    let priceValue = product.price;
    if (priceValue.includes('AED')) {
        priceValue = priceValue.replace(/AED\s*/g, '').trim();
    }
    document.getElementById('productPrice').value = priceValue;
    document.getElementById('productCategory').value = product.category;
    
    if (product.isEmoji) {
        document.getElementById('productEmoji').value = product.image;
    }
    
    // Delete the old product
    const filtered = products.filter(p => p.id !== productId);
    saveProducts(filtered);
    
    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    alert('Product loaded into form for editing. Make your changes and click "Add Product" to save.');
}

// Initialize on page load
initializeData();
displayCategories();
displayProducts();
