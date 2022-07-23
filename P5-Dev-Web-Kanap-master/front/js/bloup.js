
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
    let selectBox = document.getElementById('colors');
  
  return selectBox.selectedIex != 0 && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity < 101;
  }
  
  
  // Ajoute le produit au panier //
  function sendItems(items) {
  localStorage.setItem('items', JSON.stringify(items));
  }
  
  
  // si le panier est vide, une array est crée
  function getAllItems() {
    let items = localStorage.getItem('items');
    if (items == null) {
        return [];
    }
    return JSON.parse(items);
  }
  
  // SI dans le panier un objet avec le meme id et couleur existe, sa quantité change
  // sinon on ajoute l'objet au panier
  function addToCart(item) {
    let listOfProducts = getAllItems();
    
    let itemExists = listOfProducts.find(element => {
        return element.id == item.id && element.color == item.color;
    });
  
    if(itemExists === undefined) {
        listOfProducts.push(item)
    } else {
        itemExists.quantity += item.quantity;
    }
  
    //sauvegarde le parnier après modification dans le local storage
    sendItems(listOfProducts);
    }
    console.log(addToCart());
  
  function redirectToCart () {
    window.location.href = "cart.html";
  }
  
  // Créer un tableau //
  /* let color = 0;
  let quantity = 0;
  let cart = [];
  console.log(cart);
  
  if (localStorage.getItem("colors")) {
      color = parseInt(localStorage.getItem("colors"));
  }
  
  if (localStorage.getItem("quantity")) {
      quantity = parseInt(localStorage.getItem("quantity"));
  }
  
  if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
  }
  
  sendCart(); */
  
  // Evenement "click" // 
  /* let btn = document.getElementById("addToCart");
  
  for (let i = 0; i < btn.length; i++) {
      btn.addEventListener("click", addCart);
  } */
  
  // Ajouter au tableau // 
  // We have a problem HERE !!! //
  /* function addCart(event) {
    let image = event.target.product.imageUrl;  
    let color = event.target.product.colors;
    let name = event.target.product.name;  
    let description = event.target.product.description;
    let price = Number(event.target.product.price);
  
  if (id in cart) {
      cart[id].qty++;
  } else {
      let cartItem = {
          image: image,
          color: blue,
          name: name,
          description: description,
          price: price,
          qty: 1
      };
      cart[id] = cartItem
  }
  
      color++;
      quantity += price;
      console.log(cart);
     
      localStorage.setItem("cart", JSON.stringify(cart));
      sendCart();
  }
  console.log(addCart());
  
  function sendCart() {
      document.getElementById("quantity").textContent = quantity;
      document.getElementById("colors").textContent = color;
      localStorage.setItem("quantity", quantity);
      localStorage.setItem("colors", color);
  }
  console.log(sendCart()); */