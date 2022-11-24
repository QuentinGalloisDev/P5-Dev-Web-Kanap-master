// On prend l'élément du dom où s'affichera l'orderId
let orderId = document.getElementById("orderId");

// on récupère l'orderId dans l'url
let params = window.location.href;
let ProductId = new URL(params);
let orderInInUrl = ProductId.searchParams.get("orderId");

// Et on le place dans le dom
orderId.innerText = orderInInUrl;