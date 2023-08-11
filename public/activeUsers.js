
window.onload = async() =>{
  fetch('/room/list', {method: "GET"})
  .then(function(response) {
    return response.json();
  })
  .then(function(room) {
    var x = document.createElement("UL");
    x.setAttribute("id", "myUL");
    document.body.appendChild(x);

    var a = room.data.map(room =>{return room.room_name });
    for(i=0 ; i<2 ; i++)
    {
       var y = document.createElement("LI");
       var t = document.createTextNode(a[i]);
       y.appendChild(t);
       document.getElementById("myUL").appendChild(y);
    }
  });

}

