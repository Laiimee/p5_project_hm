
// Récupère l'API //
function getProducts() {
    return fetch('http://localhost:3000/api/products').then(r => r.json());
  }


// Tranforme le JSon en Html //  
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/join
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Template_literals
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  function transformProductsToHTML(products) {
    return `
        ${products.map(product => `
        <a href="./product.html?id=${product._id}">
          <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName"> ${product.name}</h3>
            <p class="productDescription">${product.description}</p>
          </article>
        </a>
        `).join('\n')

      }
    `
  }
  

  //Affiche le résultat //
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function
  async function init() {
    try {
      const products = await getProducts();
      document.getElementById('items').innerHTML = transformProductsToHTML(products);
    } catch(e) {
      console.error(e)
    }
  }
  
  init()