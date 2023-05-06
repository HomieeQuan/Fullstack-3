var bookmark = document.getElementsByClassName("bookmark");
var trash = document.getElementsByClassName("fa-trash");


Array.from(document.querySelectorAll('.bookmark')).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log('bookmark')
        console.log(element)
        const shoeName = this.parentNode.parentNode.querySelector('.name').innerText
        const price = this.parentNode.parentNode.querySelector('.money').innerText
    
        
        fetch('/shoeList', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            shoeName: shoeName,
            price: price,
            purchased: false
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(document.querySelectorAll('.purchased')).forEach(function(element) {
  element.addEventListener('click', function(){
    console.log('purchased')
    console.log(element)
    const shoeName = this.parentNode.parentNode.childNodes[1].innerText
    const price = this.parentNode.parentNode.childNodes[3].innerText
    console.log(shoeName,price)

    
    fetch('/shoeList', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        shoeName: shoeName,
        price: price,
        
        
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
       
        fetch('wishShoes', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: element.id
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
