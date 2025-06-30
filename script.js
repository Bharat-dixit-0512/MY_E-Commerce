const productContainer = document.querySelector('.containerF');
const searchInput = document.getElementById('searchItem');
const categoryButtons = document.querySelectorAll('.pro-name');

let allProducts = [];


const loader = document.createElement('div');
loader.innerText = 'Loading...';
loader.style.textAlign = 'center';
loader.style.fontSize = '20px';
loader.style.padding = '20px';
loader.style.color = '#007BFF';


async function fetchProducts() {
  try {
    productContainer.innerHTML = '';
    productContainer.appendChild(loader);
    const res = await fetch('https://dummyjson.com/products?limit=100');
    const data = await res.json();
    allProducts = data.products;
    displayProducts(allProducts);
  } catch (err) {
    productContainer.innerHTML = `<p>Failed to load products 😢</p>`;
    console.error(err);
  }
}


function displayProducts(products) {
  productContainer.innerHTML = '';

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products found 🧐</p>`;
    return;
  }

  products.forEach(product => {
    const item = document.createElement('div');
    item.className = 'product-card';

    item.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <small>${product.category}</small>
    `;

    item.addEventListener('click', () => showProductModal(product));
    productContainer.appendChild(item);
  });
}


function showProductModal(product) {
  const modalOverlay = document.createElement('div');
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100vw';
  modalOverlay.style.height = '100vh';
  modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '10000';

  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fff';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '10px';
  modalContent.style.maxWidth = '400px';
  modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

  modalContent.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.thumbnail}" alt="${product.title}" style="width:100%; border-radius: 6px; margin: 10px 0;">
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>Brand:</strong> ${product.brand}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <button style="margin-top: 10px; padding: 8px 12px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
  `;

  modalContent.querySelector('button').addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}


function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}


const handleSearch = debounce(() => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm)
  );
  displayProducts(filtered);
}, 300);


searchInput.addEventListener('input', handleSearch);


categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const categoryText = btn.textContent.toLowerCase().split(',')[0];
    if (categoryText === 'all') {
      displayProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p =>
        p.category.toLowerCase().includes(categoryText)
      );
      displayProducts(filtered);
    }
  });
});


fetchProducts();
