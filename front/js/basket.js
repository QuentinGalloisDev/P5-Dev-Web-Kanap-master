// Cette fonction permet de créer un nouveau tableau dans le localstorage si il n'est pas déjà présent.
function createOrGetBasket() {
    let localStoreBasket = localStorage.getItem("pan")

    let panier = JSON.parse(localStoreBasket) ?? []
    return panier
}

/* Cette fonction permet de sauvegarder un article ainsi que  sa quantité,
son id et sa couleur dans le localstorage */
function saveBasket(panier) {
    const basket = panier.map(item => {
        return {
            couleurs: item.couleurs,
            id: item.id,
            quantites: item.quantites
        }
    })
    let newPanierLocalStorage = JSON.stringify(basket);
    localStorage.setItem("pan", newPanierLocalStorage);
}