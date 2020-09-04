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

var sounds = ["sounds/crash.mp3", "sounds/kick-bass.mp3", "sounds/snare.mp3", "sounds/tom-1.mp3", "sounds/tom-2.mp3", "sounds/tom-3.mp3", "sounds/tom-4.mp3"]
for (var i=0; i<document.querySelectorAll(".drum").length; i++){
    document.querySelectorAll("button")[i].addEventListener("click",function(){keySound(this.innerHTML)})
}

document.addEventListener ("keydown", function(event){
    keySound(event.key)
})

function clickSound (audioFile) {
   
    { var audio = new Audio(audioFile);
        audio.play()}
}

function keySound (key) {
    
        switch (key) {
            case "w":
                clickSound(sounds[0])
                break;
            case "a":
            clickSound(sounds[1])
            break;
            case "s":
            clickSound(sounds[2])
            break;
            case "d":
            clickSound(sounds[3])
            break;
            case "j":
            clickSound(sounds[4])
            break;
            case "k":
            clickSound(sounds[5])
            break;
            case "l":
            clickSound(sounds[6])
            break;
        
            default:
                alert("There has been an error")
                break;
        
    }
}