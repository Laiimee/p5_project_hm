
// Appel l'url du produit par l'Id //
function getProductById(id){
  return fetch (`http://localhost:3000/api/products/${id}`).then(r => r.json());

}

// Transforme le Json en Html //
function transformProductToHTML(product) {
  let itemImg = document.querySelector('.item__img');
  itemImg.innerHTML = `<img src=${product.imageUrl} alt=${product.altTxt}>`;

  let itemTitle = document.querySelector('#title');
  itemTitle.innerHTML = `${product.name}`;

  let itemPrice = document.querySelector('#price');
  itemPrice.innerHTML = `${product.price}`;

  let itemDescription = document.querySelector('#description');
  itemDescription.innerHTML = `${product.description}`;

  let itemColors = document.querySelector('#colors');
  for (const color of product.colors) {
    let option = document.createElement('option');
    option.value = color;
    option.innerHTML = color;
    itemColors.append(option);
  }
}

// Recupère l'Id de notre produit sur l'index //
function getId(){
  let url =  new URL(window.location.href);
  console.log(window.location.href);

  let search_params = new URLSearchParams(url.search); 
  if(search_params.has('id')) {
    let id = search_params.get('id');
    console.log(id);

    return id;
  }  
}
console.log(getId());

// Affiche le résultat sur la page produit //
async function init() {
  try {
    const product = await getProductById(getId());
    transformProductToHTML(product);

    //on ajoute au panier // 
    addCart();
  } catch(e) {
    console.error(e)
  }
}
init()



// Ajoute au panier //
// Clic => Ajoute au panier //
function addCart() {
  let btn = document.getElementById('addToCart');
  let quantityInput = document.getElementById('quantity');
  let selectBox = document.getElementById('colors');
  let productId = new URLSearchParams(window.location.search).get('id');

  btn.addEventListener('click', () => {
      const item = {"id":productId, "color": colors.value, "quantity" : parseInt(quantityInput.value)};
      // si valide => ajoute au panier et redirige vers la page panier //
      if(validItem(item)) {
          addToCart(item);
          alert('Votre commande a été bien prise en compte ! ');
          quantityInput.value = 0;
          selectBox.selectedIndex = 0;
          redirectToCart ()
      } else {
          alert('Veuillez selectionner une couleur et une quantité comprise entre 1 et 100');
      }
  })
}
// Verifie si la selection est correcte //
function validItem(item) {
  return item && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity < 101;
}



// si le panier est vide, une array est crée
function getCart() {
  const cart = localStorage.getItem('cart');
  if (!cart) {
      return [];
  }
  return JSON.parse(cart);
}

function refreshCart(cart){
  localStorage.setItem('cart', JSON.stringify(cart));
}

// SI dans le panier un objet avec le meme id et couleur existe, sa quantité change
// sinon on ajoute l'objet au panier

// Ajout dans le storage
function addToCart(item) {
  const cart = getCart();
  const product = cart.find(element => {
      return element.id == item.id && element.color == item.color;
  });

  if(!product) {
      cart.push(item)
  } else {
      product.quantity += item.quantity;
  }
// remettre nouvelle version dans le storage //
  refreshCart(cart);

  }

function redirectToCart () {
  window.location.href = "cart.html";
}