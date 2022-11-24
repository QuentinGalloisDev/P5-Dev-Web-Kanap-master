// On fait une requête GET pour récupérer tout les produits stockés dans l'API
fetch(" http://localhost:3000/api/products")
  .then(images => images.json())
  .then(images2 => {

    console.log(images2);
    // Créer un élément et y insérer les nouveaux contenus

    function insertItemInView(item) {
      let section = document.getElementById("items")

      // Création des élément de la cards canapé

      let newLien = document.createElement("a")
      let newArticle = document.createElement("article")
      let newTitre = document.createElement("h3")
      let newdescription = document.createElement("p")
      let newimage = document.createElement("img")

      // Ajout des éléments dans leurs balises pour que cela corresponde à la structure html commentée

      section.appendChild(newLien);
      newLien.appendChild(newArticle);
      newArticle.appendChild(newimage);
      newArticle.appendChild(newTitre);
      newArticle.appendChild(newdescription);

      // On insert les éléments suivant leur emplacement dans l'API

      newLien.href = `product.html?id=${item._id}`;
      newTitre.innerText = item.name;
      newimage.src = item.imageUrl;
      newimage.alt = item.altTxt;
      newdescription.innerText = item.description;
    }

    // on créer une boucle pour insérer dans le dom une structure d'article suivant le nombre d'item dans l'API

    for (const item of images2) {
      insertItemInView(item)
    }


  }
  )






