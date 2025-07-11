class Pet {
    constructor(id, name, type, ownerId = null, estado = 'normal') {
        this.id = id;
        this.name = name;
        this.type = type;
        this.ownerId = ownerId; // id del héroe dueño, puede ser null
        this.estado = estado; // estado de la mascota, por defecto 'normal'
    }
}

export default Pet; 