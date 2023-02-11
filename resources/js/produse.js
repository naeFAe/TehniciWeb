// window.onload=function(){
//     x=100
//     document.getElementById("filtrare").onclick=function(){
//         var inpNume=document.getElementById("inp-nume").value;
//         //selectarea produselor,toate articolele cu clasa produs, e o colectie nu un array
//         var produse=document.getElementsByClassName("produs");
//         for(let produs of produse){//let-=in inpython
//             var cond1=false;
//             //orice atribut din html devine proprietate in javascript
//             produs.style.dysplay="none";
            
//             let nume=produs.getElementsByClassName("val-nume")[0].innerHTML;
//             if(nume.includes(inpNume)){
//                 //pastrez elementul
//                 cond1=true;
//             }

//             if(cond1){
//                 produs.style.display="block";
//             }
//         }

//     }
// }
window.onload= function(){
    x=100
       // pret minim range bar
       document.getElementById("inp-pret").onchange = function() {
        console.log(this.value);
        // pt valoare inputului
        document.getElementById("infoRange").innerHTML = `(${this.value})`
    }


    document.getElementById("filtrare").onclick=function(){
        var inpNume=document.getElementById("inp-nume").value.toLowerCase().trim();
        var inpCategorie=document.getElementById("inp-categorie").value;

        var produse=document.getElementsByClassName("produs");
        console.log(produse)
        for (let produs of produse){
            var cond1=false, cond2=false,cond3=false;
            produs.style.display="none";

            let nume= produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if(nume.includes(inpNume)){
                cond1=true;
            }
            let categorie= produs.getElementsByClassName("val-categorie")[0].innerHTML;
            if(inpCategorie=="toate" || categorie==inpCategorie){
                cond2=true;
            }

            // var radiobuttons=document.getElementsByName("gr_rad");		
            // sir="";
            // for(let rad of radiobuttons){
            //     if(rad.checked){
            //         sir=rad.value;
            //         break;//iesim din for deoarece doar un radiobutton din grup poate fi bifat (si tocmai l-am gasit)
            //     }
            
            //     if(cond1 && cond2){
            //     produs.style.display="block";
            //     }
            // }
            if(cond1 && cond2){
                produs.style.display="block";
            }
        }
    }
    document.getElementById("resetare").onclick=function(){
        //resteare produse
        var produse=document.getElementsByClassName("produs");
        for (let produs of produse){
            produs.style.display="block";
        }
        //resetare filtre
        document.getElementById("inp-nume").value="";
        document.getElementById("sel-toate").selected=true;
        document.getElementById("inp-pret").value=0;
        document.getElementById("infoRange").innerHTML='(0)';
    }

    function sorteaza(semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse=Array.from(produse);


        v_produse.sort(function(a,b){
            var pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                var nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return (pret_a-pret_b)*semn;
        })
        for (let produs of v_produse){
            produs.parentNode.appendChild(produs);
        }       
    }

    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1);
    }
}