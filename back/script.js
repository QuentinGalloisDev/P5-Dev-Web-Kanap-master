const myImage = document.getElementById("items");

fetch("../kanap01.jpeg")
  .then(function (response) {
    return response.blob();
  })
  .then(function (myBlob) {
    const objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
  });
