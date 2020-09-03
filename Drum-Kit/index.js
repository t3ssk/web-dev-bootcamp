//Color randomizer
document.querySelector("span").addEventListener("click", handleClick);

function handleClick(){
    var randR = Math.ceil(Math.random()*255);
    var randG = Math.ceil(Math.random()*255);
    var randB = Math.ceil(Math.random()*255);

    var color = "rgb("+randR+","+randG+","+randB+")"

    document.querySelector("body").style.backgroundColor = color;
}

//bubínky


for (var i=0; i<document.querySelectorAll(".drum").length; i++){
    document.querySelectorAll("button")[i].addEventListener("click", function(){alert("I got clicked")})
}