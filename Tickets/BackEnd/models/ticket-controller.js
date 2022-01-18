const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControll {
  constructor() {
    this.ultimo = 0; // ultimo ticket válido
    this.hoy = new Date().getDate(); // saca el día actual para cargar los tickests actaules
    this.tickets = []; // ultimos tickets en cola
    this.ultimos4 = []; // muestra los últimos tickets en pantalla

    this.init();
  }

  get toJson() {
    //Devuelte el objeto Json que se guardará en la base
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  init() {
    //método para inicializar los tickets leyendo de la base

    const { ultimo, hoy, tickets, ultimos4 } = require("../db/base.json"); // con esta línea se lee el json de la base
    if (hoy === this.hoy) {
      this.ultimo = ultimo,
        this.tickets = tickets,
        this.ultimos4 = ultimos4;
    } else {
      this.guardarBD();
    }
  }

  guardarBD() {
    const dbPath = path.join(__dirname, "../db/base.json"); //obtenemos el directorio donde se debe guardar
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson)); //mandamos a escribir la info
  }

  siguiente() {
    this.ultimo += 1; // aumentamos en 1 el último ticket
    const ticket = new Ticket(this.ultimo, null); //creamos una instancia con el ticket actual
    console.log(ticket);
    this.tickets.push(ticket); // agregamos este ticket al arreglo de tickets
    this.guardarBD(); // mandamos a guardar el estado de la app

    return "Ticket " + ticket.numero;
  }

  atenderTicket(escritorio) {
    console.log(this.tickets);
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift(); //extrae el ticket y lo borra del arreglo de tickets
    ticket.escritorio = escritorio; //como lo vamos a atender, le agregamos el escritorio

    this.ultimos4.unshift(ticket); //agregamos el extraído a el arreglo de los ultimos 4

    //debemos borrar si sobrepasa los últimos 4
    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1); //nos ubicamos al final del arreglo y borramos el último
    }
    this.guardarBD();
    return ticket;
  }
}

module.exports = TicketControll;
