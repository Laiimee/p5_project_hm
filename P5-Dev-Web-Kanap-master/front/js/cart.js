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

async function initCartProducts(){
    const cart = getCart();
    const datas = await Promise.all(cart.map(async item => {
        const product = await getProductById(item.id);
        return {item, product}
    }));

    for (const data of datas){
        addProductToHTML(data.product, data.item);
    }
}
 function init() {

    initCartProducts();
    initForm();
}
init();

//  Calculer le panier //

//input quantity
const cartItemQuantityInput = document.createElement('input');
cartItemQuantityInput.classList.add('itemQuantity');
setAttributes(cartItemQuantityInput, {
"type" : "number",
"name" : "itemQuantity",
"min" : "1",
"max" : "100",
"value" : product.quantity
})
cartItemQuantity.appendChild(cartItemQuantityInput);

async function DataItemsCart(){
    const items = await getCart();
    const productsOfCart = [];

    calculateTotals(productsOfCart);

    const inputField = document.querySelectorAll('.itemQuantity');
    updateTotals(inputField, productsOfCart);

    
    const deleteItemBtn = document.querySelectorAll('.deleteItem');
    const sectionOfCartItems = document.getElementById('cart__items');
    const articleCartItem = document.querySelectorAll('.cart__item');
    deleteItemFromTheCart(deleteItemBtn,productsOfCart, sectionOfCartItems, articleCartItem); 
}
DataItemsCart ();

// calcul du nombre d'article total et du prix total
function calculateTotals(cart) {
    const totalQuantityOfArticles = document.getElementById('totalQuantity');
    const totalPriceOfArticles = document.getElementById('totalPrice');
    totalQuantityOfArticles.innerText = calculateQuantity(productsOfCart);
    totalPriceOfArticles.innerText = calculateTotalPrice(productsOfCart);
}

// fonction de calcul de la quantité total
function calculateQuantity(productsOfCart) {
    return items.reduce((a, b) => {
        return a + b.quantity;
    }, 0);
}
// fonction de calcul du prix total
function calculateTotalPrice(productsOfCart) {
    //total du prix
    return items.reduce((a, b) => {
        return a + (b.price * b.quantity);
    }, 0);
}






// Ajouter information formulaire //
function initForm(){
    const form = document.querySelector('form.cart__order__form');
    console.log('initForm', form);
    form.addEventListener('submit', (event) => {
        console.log('submit', event);
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const email = document.getElementById('email').value;
        const contact = { firstName,lastName,address,city,email };

        if(!validForm(contact)){
            return false;
        }

        buyCart(getCart(),contact);
       
    }
   )   
}
function buildFormData(formData, data, parentKey) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;
  
      formData.append(parentKey, value);
    }
  }
  
  function jsonToFormData(data) {
    const formData = new FormData();
    
    buildFormData(formData, data);
    
    return formData;
  }
  
async function buyCart(cart,contact){
    try{
        const response = await fetch(`http://localhost:3000/api/products/order`,{method:'post',headers:{"content-type":"application/x-www-form-urlencoded"}, body:jsonToFormDatas({contact,products:cart})});
        console.log(response);
        if(response.statusCode == 200){
            redirectToConfirmation();
        }else{ alert("une erreur s'est produit");}
        
    }catch(e){
        console.error(e);
        alert("une erreur s'est produit");
    }
   
}

function validForm({firstName,lastName,address,city,email}){
    let  isValide = true ;

    if(!/^[\w\.\d]+@[\w\d]+\.[\w]+$/.test(email)){
        document.getElementById('emailErrorMsg').innerHTML="invalide";
        isValide = false;
    }
    if(!/^\w+$/.test(firstName)){
        document.getElementById('firstNameErrorMsg').innerHTML="invalide";
        isValide = false;
    }
    if(!/^\w+$/.test(lastName)){
        document.getElementById('lastNameErrorMsg').innerHTML="invalide";
        isValide = false;
    }
    if(!/^\w+$/.test(address)){
        document.getElementById('addressErrorMsg').innerHTML="invalide";
        isValide = false;
    }
    if(!/^\w+$/.test(city)){
        document.getElementById('cityErrorMsg').innerHTML="invalide";
        isValide = false;
    }
    return isValide

}

function redirectToConfirmation() {
    window.location.href = "confirmation.html";
  }