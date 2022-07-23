// Afficher les produits dans le pannier //

function getProductById(id){
    return fetch (`http://localhost:3000/api/products/${id}`).then(r => r.json());
}

function refreshCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
  }

function getCart() {
    const cart = localStorage.getItem('cart');
    if (!cart) {
        return [];
    }
    return JSON.parse(cart);
}

function removeCartItem(article){
    let cart = getCart();
    cart = cart.filter(item => item.id !== article.dataset.id || item.color !==  article.dataset.color); 
    refreshCart(cart);
}

function removeProductHTML(article){
    article.remove();
}

function addProductToHTML(product,item){
   
  const article = document.createElement('article');
  article.className ='cart__item';
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  
  const cart__item__img = document.createElement('div');
  cart__item__img.className = 'cart__item__img';
  cart__item__img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  const cart__item__content = document.createElement('div');
  const cart__item__content__description = document.createElement('div');
  cart__item__content.className = 'cart__item__content';
  cart__item__content__description.className = 'cart__item__content__description';
  cart__item__content__description.innerHTML=`
    <h2>${product.name}</h2>
    <p>${item.color}</p>
    <p>${product.price}</p>`;
  cart__item__content.append(cart__item__content__description);

  const cart__item__content__settings = document.createElement('div');
  const cart__item__content__settings__quantity = document.createElement('div');
  cart__item__content__settings.className = 'cart__item__content__settings';
  cart__item__content__settings__quantity.className = 'cart__item__content__settings__quantity';
  cart__item__content__settings__quantity.innerHTML = `
    <p>Qté : </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">`;
  cart__item__content.append(cart__item__content__settings);
  cart__item__content__settings.append(cart__item__content__settings__quantity);

  const cart__item__content__settings__delete = document.createElement('div');
  cart__item__content__settings__delete.className = 'cart__item__content__settings__delete';
  const deleteItem = document.createElement('p');
  deleteItem.className = 'deleteItem';
  deleteItem.innerText = 'Supprimer';
  cart__item__content__settings.append(cart__item__content__settings__delete);

  cart__item__content__settings__delete.append(deleteItem);
    article.append(cart__item__img);
    article.append(cart__item__content);
  document.getElementById('cart__items').append(article);
  
  deleteItem.addEventListener('click', () => {
        removeCartItem(article);
        removeProductHTML(article);
    })
}

async function init() {
    const cart = getCart();
    const datas = await Promise.all(cart.map(async item => {
        const product = await getProductById(item.id);
        return {
            item, product
        }
    }));

    for (const data of datas){
        addProductToHTML(data.product, data.item);
    }

    getForm(addEventListener);
}

init();

// Ajouter information formulaire //

function getForm(){
    const form = document.querySelector('.cart__order__form');

    form.addEventListener('submit', () => {
        const info = ;
        if{

        }else{
            alert('')
        }
    })
    
}

function validForm(){

}