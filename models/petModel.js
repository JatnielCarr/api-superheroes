class Pet {
    constructor(id, name, type, ownerId = null) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.ownerId = ownerId; // id del héroe dueño, puede ser null
    }
}

export default Pet; 