// Afficher le numéro de commande dans la page confirmation //

/* function getNumberOrders(id){
    return fetch (`http://localhost:3000/api/products/order`).then(r => r.json());
}

function initNumberOrder(cart,contact){
    
}
 */
// récupérer le localStorage
const params = new URLSearchParams(location.search)
let id = params.get("id")
console.log(id)

const orderId = document.getElementById("orderId")
orderId.innerHTML = id
localStorage.clear()