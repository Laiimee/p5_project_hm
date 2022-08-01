// Afficher le numéro de commande dans la page confirmation //

function getNumberOrders(id){
    return fetch (`http://localhost:3000/api/products/order`).then(r => r.json());
}

function initNumberOrder(cart,contact){
    
}