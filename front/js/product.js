// Requêter l'API suivant l'ID du produit pour récupérer les infos du produit en question et les afficher dans la page.
// Afficher : image du produit , le nom du produit, son prix, sa description et ses options de couleurs.

// On récupère l'id du produit qui est dans l'url de la page actuelle.
let params = window.location.href;
let ProductId = new URL(params);
let id = ProductId.searchParams.get("id");

// Cette fonction ajoute un article au panier si son id et sa couleur diffère  
function addItemToBasket(id, color, quantites) {
  let panier = createOrGetBasket();

  let lignePanier = { id: id, couleurs: color, quantites: quantites }
  // La méthode findIndex renvoie 1 si deux articles dans le panier ont le même id ET la même couleur.
  let index = panier.findIndex(itemPanier => {
    return id == itemPanier.id && color == itemPanier.couleurs;
  })
  // Si findIndex renvoie >= 0 alors on incrémente la quantités
  if (index >= 0) {
    panier[index].quantites += quantites;
  }
  // Sinon on créer une nouvelle ligne produit
  else if (lignePanier.couleurs != "" && lignePanier.quantites >= 1) {
    panier.push(lignePanier);
  }
  // on stock dans localstorage
  saveBasket(panier)
}
// On fait une requête GET pour récupérer les données de l'article suivant son id
fetch(`http://localhost:3000/api/products/${id}`)
  .then(images => images.json())
  .then(images2 => {

    // On créer un élément img 
    let image = document.querySelector(".item article .item__img");
    let newImage = document.createElement("img");

    // Et on y insère la photo de l'élément suivant l'id de l'url
    image.appendChild(newImage);
    newImage.src = images2.imageUrl;
    newImage.alt = images2.altTxt;

    // on remplace le texte dans l'élément titre par les données de name de l'API
    let titre = document.getElementById("title");
    titre.innerText = images2.name;

    // On remplace le contenu du paragraphe p Par le prix contenue dans le price de l'API
    let prix = document.getElementById("price");
    prix.innerText = images2.price;

    // On remplace le contenu du paragraphe description par la description contenu dans l'API

    let description = document.getElementById("description");
    description.innerText = images2.description;

    // Om créer une boucle pour faire parcourir les couleurs contenu dans l'array colors 

    let couleurs = images2.colors;

    for (const i of couleurs) {

      let option = document.getElementById("colors");
      let newOption = document.createElement("option");
      option.appendChild(newOption);
      newOption.value = i;
      newOption.innerText = i;

    }
    // On récupére le boutton ajouter au panier et on écoute l'évènement click.
    let addCart = document.getElementById("addToCart");
    addCart.addEventListener("click", (event) => {
      // On récupère la couleurs
      let couleur = document.getElementById("colors");
      couleur.addEventListener("change", (event))
      let color = couleur.value;
      //On récupère la quantités
      let quantite = document.getElementById("quantity");
      let quantites = parseInt(quantite.value);

      addItemToBasket(id, color, quantites)

    })

  })

