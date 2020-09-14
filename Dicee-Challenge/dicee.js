var randomNum = Math.floor(Math.random()*6);
var randomNum2 = Math.floor(Math.random()*6);
var arr = ["images/dice1.png", "images/dice2.png", "images/dice3.png", "images/dice4.png", "images/dice5.png", "images/dice6.png",]
document.querySelector('.img1').setAttribute("src", arr[randomNum])
document.querySelector('.img2').setAttribute("src", arr[randomNum2])

function getWinner() {
    if(randomNum > randomNum2){
        return "Pavlína má pravdu"
    } else if (randomNum < randomNum2){
        return "Adam má pravdu"
    } else {
        return "🤷🏻‍♀️Pravda je někde uprostřed🤷🏻‍♀️"
    }
}
document.querySelector("h1").innerHTML = getWinner()