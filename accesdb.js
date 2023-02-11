class AccesBD{
    static #instanta=null;

    constructor(){
        if(this.#instanta){
            throw new Error("Deja a fost instantiat");
        }
    }
    initLocal(){
        this.client=new this.client({database:"laborator",
            user:"stefan",
            password:"stefan",
            host:"localhost",
            port:"5432"
        })
        this.client.connect();
    }
    getClient(){
        if(!this.#instanta){
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }

    static getInstanta(){
        console.log(this);//this-ul e clasa nu instanta pt ca metoda statica
        if(!this.#instanta){
            this.#instanta=new AccesBD();
        }
        return this.#instanta;
    }
}