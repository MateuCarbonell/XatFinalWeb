// Variables globales
// user, pass, mail, codeCountry, session, friend, receptor, sms (ESTAS SON LAS VARIABLES QUE SE USAN EN TODO EL PROYCTO)

// Función para el servicio de Registro
function registrarUsuario() { // 
    let user = document.getElementById("user").value;
    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;
    let country = document.getElementById("country").value;
    alert("Usuario: "+user+" Mail: "+mail+" Pass: "+ pass+" Country: "+country);
    
    var http = new XMLHttpRequest();
    http.open("POST","http://localhost:3004/WebXat/Register",true);
    http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    http.onload = function(){
        if(this.readyState== 4 && http.status==200){
            if(http.responseText === "true"){
                alert("Registro completado");
                window.location.href = "index.html";
            }else{
                alert("Registro no competado");
            }
        }
    }
    http.send("user=" + user +"&mail=" + mail + "&pass=" + pass + "&country=" + country);

}
  

  
  



// Función para el servicio de Llista de Països
function obtenerListaPaises() {
   
  
    var http = new XMLHttpRequest();
    http.open("GET", "http://localhost:3004/WebXat/Register" , true);
  
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200) {
        var data = JSON.parse(http.responseText);
        console.log(data);
        
        var dropdown = document.getElementById('country'); 
  
        // Limpiar opciones existentes
        dropdown.innerHTML = '';
  
        // Iterar sobre los datos y crear opciones
       data.forEach(function(p){
           
        var option = document.createElement("option");
        option.text = p.name;
        option.value=p.code
        dropdown.add(option);
            
       
      });
    }
}
    http.send();
}

// Función para el servicio de Login
function iniciarSesion() {
    var http = new XMLHttpRequest();

    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;
  
  
    http.open("GET", "http://localhost:3004/WebXat/Login?mail="+mail+"&pass="+pass, true);
  
    http.onreadystatechange = function(){
        if(this.readyState==4 && this.status==200){
            var session = http.responseText;
            if(session !== null){
                sessionStorage.setItem("session",session)
                sessionStorage.setItem("mail",mail);
                window.location.href="menu.html"
            }else{
                alert("Session interrumpida. Vuelva a intentralo");
            }
        }
    }
    http.send();

}

// Función para el servicio de Afegir un amic
function agregarAmigo() {
  // Utilizar las variables globales mail, session y friend en la solicitud HTTP POST
  // Realizar la solicitud HTTP POST para agregar un amigo a la lista
  // La respuesta será un código del 0 al 3, según el resultado

  var http = new XMLHttpRequest();

  var mail = sessionStorage.getItem('mail');
  var session = sessionStorage.getItem('session');
  var friend = document.getElementById("friend").value;
  http.open("POST","http://localhost:3004/WebXat/Friend?mail=" + mail +"&session=" + session + "&friend=" + friend)
  http.send()
  

  window.location.replace("menu.html")

}

// Función para el servicio de Rebir llista d'amics
function obtenerListaAmigos() {
    var http = new XMLHttpRequest();
    console.log("Antes de sessionstorage")
    var mail = sessionStorage.getItem('mail');
    var session = sessionStorage.getItem('session');
    http.open("GET", "http://localhost:3004/WebXat/Friend?mail=" + mail + "&session=" + session, true);
    console.log("antes del readystate")
    http.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var response = JSON.parse(http.responseText);
          var listaAmigosHTML = "";
  
          for (var i = 0; i < response.length; i++) {
            var amigo = response[i];
            listaAmigosHTML += "<p>" + amigo + "</p>";
          }
  
          document.getElementById("lista-amigos").innerHTML = listaAmigosHTML;
        } else {
          alert("Error en la conexión");
        }
      }
    };
  
    http.send();
  }
  
  
  







function enviarXat() {
    var mail = sessionStorage.getItem("mail");
    var session = sessionStorage.getItem("session");
    var receptor = document.getElementById("friend").value;
    var sms = document.getElementById("mensajes").value;
    var http = new XMLHttpRequest();

    http.open("POST", "http://localhost:3004/WebXat/Xat?mail=" + mail + "&session=" + session + "&receptor=" + receptor + "&sms=" + sms);

    http.onload = function () {
        if (this.readyState == 4 && http.status == 200) {
            var conver = document.getElementById("chat-messages");
            var msg = document.createElement("p");
            msg.textContent = "Tu: " + sms;
            conver.appendChild(msg);
            rebreXat();
            document.getElementById("mensajes").value = "";
        } else {
            console.error("Error en enviarXat", http.status);
        }
    };

    http.send();
}

function rebreXat() {
    var mail = sessionStorage.getItem("mail");
    var session = sessionStorage.getItem("session");
    var http = new XMLHttpRequest();

    http.open("GET", "http://localhost:3004/WebXat/Xat?mail=" + mail + "&session=" + session);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && http.status == 200) {
            var response = http.responseText;
            console.log("Respuesta recibida: ", response);
            try {
                var message = JSON.parse(response);
                var conver = document.getElementById("chat-messages");
                var texto = message.text;
                var emisor = message.emisor;
                var msg = document.createElement("p");
                msg.textContent = "De: " + emisor + ": " + texto;
                conver.appendChild(msg);
                rebreXat();
                console.log("Después del append");
            } catch (error) {
                console.error("Error al analizar JSON: " + error);
            }
        }
    };

    http.send();
}
rebreXat();


      






function logOut(){
    window.location.replace("index.html")
    sessionStorage.removeItem("session");
}