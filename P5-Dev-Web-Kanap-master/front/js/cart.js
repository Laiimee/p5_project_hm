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

function getParent(element, num) {
    let parent = element;
    for (let i = 0; i < num; i++) {
        if (parent.parentNode) {
            parent = parent.parentNode;
        }
    }
    return parent; 
}

function setTotal(array, elemPrice, elemQuantity)
{
    array.total.totalQteItems = getTotal(array, 'quantity');
    array.total.totalItems = getTotal(array); 

    elemPrice.innerHTML = array.total.totalItems; 
    elemQuantity.innerHTML = array.total.totalQteItems; 
}

function addProductToHTML(datas){

  for(const elem of datas) 
    {
        const article = document.createElement('article');
        article.className ='cart__item';
        article.dataset.id = elem.item.id;
        article.dataset.color = elem.item.color;
        
        const cart__item__img = document.createElement('div');
        cart__item__img.className = 'cart__item__img';
        cart__item__img.innerHTML = `<img src="${elem.product.imageUrl}" alt="${elem.product.altTxt}">`;
    
        const cart__item__content = document.createElement('div');
        const cart__item__content__description = document.createElement('div');
        cart__item__content.className = 'cart__item__content';
        cart__item__content__description.className = 'cart__item__content__description';
        cart__item__content__description.innerHTML=`
        <h2>${elem.product.name}</h2>
        <p>${elem.item.color}</p>
        <p>${elem.product.price}€</p>`;
        cart__item__content.append(cart__item__content__description);
    
        const cart__item__content__settings = document.createElement('div');
        const cart__item__content__settings__quantity = document.createElement('div');
        cart__item__content__settings.className = 'cart__item__content__settings';
        cart__item__content__settings__quantity.className = 'cart__item__content__settings__quantity';
        cart__item__content__settings__quantity.innerHTML = `
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${elem.item.quantity}">`;
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
        
    
        const totalPrice = document.getElementById('totalPrice'); 
        totalPrice.innerHTML = datas.total.totalItems; 
    
        const totalQuantity = document.getElementById('totalQuantity'); 
        totalQuantity.innerHTML = datas.total.totalQteItems; 
    
        deleteItem.addEventListener('click', () => {
            removeCartItem(article);
            removeProductHTML(article);
            const index = datas.indexOf(elem);
            datas.splice(index, 1); 
            setTotal(datas, totalPrice, totalQuantity); 
        })

        
        const inputQtes = document.querySelectorAll('.itemQuantity'); 
        for(const inputQte of inputQtes)
        {
            inputQte.addEventListener('change', (e) => {
                const elemId = getParent(inputQte, 4).dataset.id; 
                const datasElem = datas.find(elem => elem.item.id == elemId); 
                datasElem.item.quantity = parseInt(e.target.value); 
                datasElem.total = datasElem.item.quantity * datasElem.product.price; 
                setTotal(datas, totalPrice, totalQuantity);
            }) 
        }
       
        
    }

}


function getTotal(datas, type = '')
{
    let total = 0; 
    for (const item of datas){
        if(type == 'quantity') 
        {
            total += item.item.quantity; 
        }
        else 
        {
            total += item.total; 
        }
    }

    return total; 
}

async function initCartProducts(){
    const cart = getCart();
    let total = 0; 
    const datas = await Promise.all(cart.map(async item => {
        const product = await getProductById(item.id);
        total= item.quantity * product.price; 
        let obj = {item, product, total}
        return obj; 
    }));

    let totalItems = getTotal(datas); 
    let totalQteItems = getTotal(datas, 'quantity'); 

    datas['total'] = {totalItems, totalQteItems}; 

    addProductToHTML(datas); 
}
 function init() {

    initCartProducts();
    initForm();
}
init();


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
        const response = await fetch(`http://localhost:3000/api/products/order`,
        { method:'post',
            headers:{"content-type":"application/json; charset=utf-8"}, 
            body:jsonToFormData({contact,products:cart})});
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

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
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