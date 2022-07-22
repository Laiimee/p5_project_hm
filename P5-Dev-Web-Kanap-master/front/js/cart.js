/* 
to do page pannier 

creer un tableau vide 

=> local.storage <=

recup
id
color
Number

Event = click, afficher dans panier 

option regarder deja une ligne / ajouter m^me value ajouter quantité
=> if{} else{} <=

FULL console.log();
*/


/* 

// Au click ajouter au panier //
function clickCard(){
    let setProduct = localStorage.setProduct('itemQuantity,color-select');
    if{

    }else{

    }
    console.log(setProduct);  
}

// Envoyer sendCart dans local storage //
function sendCart(){

}

// Affiche le résultat sur la page panier //
async function init(){
    try{
        const = ;

    }catch(e){
        console.error(e)
    }
}
init()


*/



/* let cart = [];
console.log(cart);
 */
let cart = [];
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}

let tbody = document.getElementById("tbody");

for (let id in cart) {
    let item = cart[id];

    let tr = document.createElement('tr')

    let title_td = document.createElement('td')
    title_td.textContent = item.title
    tr.appendChild(title_td)


    let price_td = document.createElement("td");
    price_td.textContent = item.price;
    tr.appendChild(price_td);

    let qty_td = document.createElement("td");
    qty_td.textContent = item.qty;
    tr.appendChild(qty_td);

    tbody.appendChild(tr)

}