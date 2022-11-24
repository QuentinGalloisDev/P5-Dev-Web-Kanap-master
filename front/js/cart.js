// On créer un nouveau tableau panierFinale sur la base du panier locale en ajoutant les données de l'API
let panierFinal = createOrGetBasket().map(localItem => {
    return fetch(`http://localhost:3000/api/products/${localItem.id}`)
        .then(images => images.json())
        .then(onlineItem => {

            localItem.price = onlineItem.price;
            localItem.imageUrl = onlineItem.imageUrl;
            localItem.altTxt = onlineItem.altTxt;
            localItem.name = onlineItem.name;
            return localItem
        })
})
// On créer une fonction qui va recréer les éléments du DOM à chaque changement de quantités.
function cleanAndReload() {
    var localItem = items

    let section = document.getElementById("cart__items");
    document.querySelectorAll(".cart__item").forEach(el => el.remove());

    // On affiche un message si le panier est vide
    if (localItem.length <= 0) {
        let divCartAndFormContainer = document.querySelector("#cartAndFormContainer .cart");
        let createTitleForCartEmpty = document.createElement("p");
        divCartAndFormContainer.prepend(createTitleForCartEmpty);
        createTitleForCartEmpty.innerText = "Votre panier est vide";
    }
    // Sinon on créer les éléments dans le DOM
    else {

        localItem.map(localItem => {
            //Article
            let createArticle = document.createElement("article");
            createArticle.classList.add("cart__item");
            section.appendChild(createArticle);
            importDataFromPanierForArticle(createArticle, localItem);
            // Article
            // div img
            createDivImage(createArticle, localItem);
            // div img
            // div cart item content
            let createdivCart__item__content = document.createElement("div");
            createdivCart__item__content.classList.add("cart__item__content");
            createArticle.appendChild(createdivCart__item__content);
            // div cart item content
            // description
            description(createdivCart__item__content, localItem);
            settings(createdivCart__item__content, localItem, createArticle);
            createDivForButtonDelete(createdivCart__item__content, createArticle, localItem);
            // description
        })
    }
    calculTotalPrice(localItem);

    totalArticles(localItem);

}

var items = []
// On récupère les promesses de panierFinale et on place leurs données dans items.
Promise.all(panierFinal)
    .then(localItem => {
        items = localItem;
        cleanAndReload();
    })

// On récupère l'élément dans lequel on affichera le prix total
let totalPriceTxt = document.getElementById("totalPrice");
// On récupère l'élément dans lequel on affichera le total d'articles
let totalArticlesTxt = document.getElementById("totalQuantity")
// Cette fonction calcul le prix total et l'affiche 
function calculTotalPrice(item) {
    var total = 0;
    for (let i of item) {
        total += i.quantites * i.price;
    }
    totalPriceTxt.innerText = total;
    console.log(total);
    return total
}
// Cette fonction calcul le total d'articles et l'affiche 
function totalArticles(item) {
    var totalArticle = 0;
    for (let i of item) {
        totalArticle += i.quantites;
    }
    totalArticlesTxt.innerText = totalArticle;
    console.log(totalArticle);
    return totalArticle
}

// On importe les données du panier pour les dataset des articles
function importDataFromPanierForArticle(article, local) {
    article.dataset.id = local.id;
    article.dataset.color = local.couleurs;
}
// Cette fonction importe les images du local 
function importImage(divImage, local) {
    divImage.src = local.imageUrl;
    divImage.alt = local.altTxt;
}
// Cette fonction créer une balise div et une img et importe les images grâce à la fonction importImage
function createDivImage(article, local) {
    let createDivCart__item__img = document.createElement("div");
    createDivCart__item__img.classList.add("cart__item__img");
    let createImage = document.createElement("img");
    article.appendChild(createDivCart__item__img);
    createDivCart__item__img.appendChild(createImage);
    importImage(createImage, local)
}
//Cette fonction importe le prix, la couleur et le nom depuis panierfinale
function importDescription(title, color, price, local) {
    title.innerText = local.name;
    color.innerText = local.couleurs;
    price.innerText = local.price + " €";
}
// Cette fonction créer et insère dans le dom la div cart__item__content__description et son contenu: le nom de l'article, son prix et sa couleur.
function description(itemContent, local) {
    let createDivCart__item__content__description = document.createElement("div");
    createDivCart__item__content__description.classList.add("cart__item__content__description");
    let createTitle = document.createElement("h2");
    let createParagraphForColor = document.createElement("p");
    let createParagraphForPrice = document.createElement("p");
    itemContent.appendChild(createDivCart__item__content__description);
    createDivCart__item__content__description.appendChild(createTitle);
    createDivCart__item__content__description.appendChild(createParagraphForColor);
    createDivCart__item__content__description.appendChild(createParagraphForPrice);
    importDescription(createTitle, createParagraphForColor, createParagraphForPrice, local);
}
// Cette fonction importe la quantités d'articles du local vers l'input du dom.
function importSettings(quantity, local) {
    quantity.value = local.quantites;

}
// Cette fonction permet de modifier la quantités d'articles du panier ou d'en supprimer.
function changeQuantity(quantity, local) {
    if (quantity <= 0) {
        items = items.filter(e => e.id != local.id || e.couleurs != local.couleurs);
    }
    else {
        local.quantites = quantity++;
    }
    saveBasket(items);
    cleanAndReload();
}
// Cette fonction créer et importe la div cart__item__content__settings et son contenu: l'input type number avec la quantités.
function settings(itemContent, local) {
    let createDivCart__item__content__settings = document.createElement("div");
    createDivCart__item__content__settings.classList.add("cart__item__content__settings");
    let createDivCart__item__content__settings__quantity = document.createElement("div");
    createDivCart__item__content__settings__quantity.classList.add("cart__item__content__settings__quantity");
    let createParagraphForQuantity = document.createElement("p");
    createParagraphForQuantity.innerText = "Qté : ";
    let createInputForQuantity = document.createElement("input");
    createInputForQuantity.type = 'number';
    createInputForQuantity.name = 'itemQuantity';
    createInputForQuantity.classList.add("itemQuantity")
    createInputForQuantity.min = 0;
    createInputForQuantity.max = 100;
    itemContent.appendChild(createDivCart__item__content__settings);
    createDivCart__item__content__settings.appendChild(createDivCart__item__content__settings__quantity);
    createDivCart__item__content__settings__quantity.appendChild(createParagraphForQuantity);
    createDivCart__item__content__settings__quantity.appendChild(createInputForQuantity);
    importSettings(createInputForQuantity, local);
    createInputForQuantity.addEventListener("change", (event) => {
        changeQuantity(createInputForQuantity.value, local);
    })

}
// Cette fonction créer et importe dans le DOM la div cart__item__content__settings__delete et son contenu qui est le paragraphe cliquable "supprimer".
function createDivForButtonDelete(itemContent, article, local) {
    let createDivCart__item__content__settings__delete = document.createElement("div");
    createDivCart__item__content__settings__delete.classList.add("cart__item__content__settings__delete");
    let createParagrapForDeletion = document.createElement("p");
    createParagrapForDeletion.classList.add("deleteItem");
    createParagrapForDeletion.innerText = "Supprimer";
    itemContent.appendChild(createDivCart__item__content__settings__delete);
    createDivCart__item__content__settings__delete.appendChild(createParagrapForDeletion);
    createParagrapForDeletion.addEventListener("click", (event) => {
        changeQuantity(0, local);
    })

}
// On récupère les emplacement de messages d'erreurs
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
let addressErrorMsg = document.getElementById("addressErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");

// Cette fonction affiche un message d'erreur en dessous d'un champ du formulaire de contact.
function displayErrorMessage(errorMessage) {
    errorMessage.innerText = "Les données de ce champ ne sont pas valides";
}
// On récupère les emplacements des champs du formulaire
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
// On créer une fonction qui vérifie la validité des pattern des champs du formulaire.  
function checkValidityOnElementOrErrorMessage(element, errorMessage) {

    if (element.checkValidity() == false) {
        displayErrorMessage(errorMessage);
        return false
    }
    errorMessage.remove();
    return true
}
// Cette fonction importe le contenu du champ du formulaire dans l'objet contact si le champ est valide
function pushInContact(element, errorMessage) {
    if (checkValidityOnElementOrErrorMessage(element, errorMessage)) {
        contact.element = element.value;
    }
}
//On récupère le boutton commander du formulaire.
let order = document.getElementById("order");
// On écoute le click sur le boutton commander.
order.addEventListener("click", (event) => {
    // On empêche le rafraichissement de la page par défault.
    event.preventDefault();

    //On créer un constante qui est vrai si tout les champs du formulaire sont valide
    const success =
        checkValidityOnElementOrErrorMessage(firstName, firstNameErrorMsg) &&
        checkValidityOnElementOrErrorMessage(lastName, lastNameErrorMsg) &&
        checkValidityOnElementOrErrorMessage(address, addressErrorMsg) &&
        checkValidityOnElementOrErrorMessage(city, cityErrorMsg) &&
        checkValidityOnElementOrErrorMessage(email, emailErrorMsg)

    // Si la constante est vrai alors on créer un objet contact et un tableau constitué des id des produits présents dans panierFinal.
    if (success) {
        const request = {
            contact: {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                email: email
            },
            products: items.map(item => item.id)
        }
        // Si tout les champ du formulaire sont ok, envoyer avec une requete post le contact et le tableau de produits présents dans items
        fetch(`http://localhost:3000/api/products/order`, {
            mode: "cors",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)

        })
            .then((response) => response.json())
            .then((data) => {
                // On récupère le numéro de commande dans la réponse
                let orderId = data.orderId;
                // On redirige l'utilisateur vers la page confirmation en ajoutant le numéro de commande dans l'url.
                window.location.href = `confirmation.html?orderId=${orderId}`;
            })
            .catch((error) => {
                console.log('Error:', error);
            })

    }
})

