
const express= require("express");
const fs=require("fs");
const sharp = require("sharp");
const { pathToFileURL } = require("url");
const { render } = require("ejs");

app=express();

app.set("view engine","ejs");
console.log("Cale proiect:", __dirname);
app.use("/resources",express.static(__dirname+"/resources"));
//var cssBootstrap = sass.compile(__dirname + "/Resources/SCSS/custom.scss", {sourceMap:true});
// sourceMap este pt a putea sa facem debug in browser
//fs.writeFileSync(__dirname + "/Resources/CSS/libraries/custom.css", cssBootstrap.css);
// Etapa 5
const {Client} = require("pg");
var client = new Client({
    database:"laborator",
    user:"stefann",
    password:"ligruhtc6",
    host:"localhost",
    port:5432
});
client.connect();
obGlobal={
    erori:null,
    imagini:null
}

client.query("select * from tabel_test",function(err,rez){
    //daca e eroare afis eroare 
    if(err)
    console.log(err);
    else
    console.log(rez);
});

// function createImages(){
//     var continutFisier=fs.readFileSync(__dirname+"/resources/json/galerie.json").toString("utf8");
//     //console.log(continutFisier);
//     var obiect=JSON.parse(continutFisier);
//     var dim_mediu=300;
//     var_dim_mic=150;
//     obGlobal.imagini=obiect.imagini
//     obGlobal.imagini.forEach(function(elem){
//         [fileName,extension] = elem.fisier.split(".");
//         if(!fs.existsSync(obiect.cale_galerie + "/medium/")){
//             fs.mkdirSync(obiect.cale_galerie + "/medium/");
//         }
//         elem.medium_file = obiect.cale_galerie + "/" + fileName + ".webp"
//         elem.fisier = obiect.cale_galerie +"/medium/" + elem.fisier;
    
//     // obGlobal.imagini.forEach(function(elem){
//     //     elem.fisier=obiect.cale_galerie+"/"+elem.fisier;
//     //     sharp(__dirname+"/"+elem.fisier).resize(dim_mediu).tpFIle(elem.fisier_mediu)
//     // })
//     // console.log(obGlobal.imagini);
//     });

//     console.log(obGlobal.imagini);
// }
createImages();
function createImages(){
    var continutFisier=fs.readFileSync(__dirname+"/resources/json/galerie.json").toString("utf8");
    //console.log(continutFisier);
    var obiect=JSON.parse(continutFisier);
    

    obGlobal.imagini=obiect.imagini
    obGlobal.imagini.forEach(function(elem){
        elem.fisier=obiect.cale_galerie+"/"+elem.fisier;
    })
    console.log(obGlobal.imagini);
}
createImages();
function createErrors(){
    var continutFisier=fs.readFileSync(__dirname+"/resources/json/erori.json").toString("utf8");
    //console.log(continutFisier);
    obGlobal.erori=JSON.parse(continutFisier);
    //console.log(obErori.erori);
}
createErrors();

function renderError(res, identificator, titlu, text, imagine){
    var eroare = obGlobal.erori.info_erori.find(function(elem){
        return elem.identificator==identificator;
    })
    titlu= titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu;
    text= text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text;
    imagine= imagine || (eroare && obGlobal.erori.cale_baza+"/"+eroare.imagine) || obGlobal.erori.cale_baza+"/"+obGlobal.erori.eroare_default.imagine;
    if(eroare && eroare.status){
        res.status(identificator).render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine})
    }
    else{
        res.render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine});
    }
}


app.get(["/","/index","/home"],function(req, res){
    console.log("ceva");
    //res.sendFile(__dirname+ "/index.html");
    //res.write("nu stiu");
    //res.end();
    res.render("pagini/index", {ip: req.ip,imagini:obGlobal.imagini});
});

app.get("/produse",function(req, res){
    client.query("select * from filme",function(err,rez){
        //daca e eroare afis eroare 
        if(err){
        console.log(err);
        renderError(res,2);
    }
        else
        res.render("pagini/produse", {produse:rez.rows,optiuni:[]});

    });
});
app.get("/produs/:id",function(req, res){
    console.log(req.params);
    client.query("select * from filme where id="+req.params.id,function(err,rez){
        //daca e eroare afis eroare 
        if(err){
        console.log(err);
        renderError(res,2);
    }
        else
        res.render("pagini/produs", {prod:rez.rows,optiuni:[]});

    });
});


app.get("/*.ejs",function(req,res){
    renderError(res,403);
});
app.get("/*",function(req, res){
    console.log("url:",req.url);
    //res.sendFile(__dirname+ "/index.html");
    //res.write("nu stiu");
    //res.end();
    res.render("pagini"+req.url, function(err,rezRandare){
        //console.log("Eroare", err);
        //console.log("Rezultat randare", rezRandare);

        if(err){
            if(err.message.includes("Failed to lookup view")){
                renderError(res,404);
            }
            else{

            }
        }
        else{
            res.send(rezRandare);
        }


    });
});
console.log("Hello world!");

app.listen(8080);
console.log("Serverul a pornit!");