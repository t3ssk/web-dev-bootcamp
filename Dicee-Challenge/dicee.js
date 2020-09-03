var randomNum = Math.floor(Math.random()*6);
var randomNum2 = Math.floor(Math.random()*6);
var arr = ["images/dice1.png", "images/dice2.png", "images/dice3.png", "images/dice4.png", "images/dice5.png", "images/dice6.png",]
document.querySelector('.img1').setAttribute("src", arr[randomNum])
document.querySelector('.img2').setAttribute("src", arr[randomNum2])

function getWinner() {
    if(randomNum > randomNum2){
        return "🏅Player 1 wins!"
    } else if (randomNum < randomNum2){
        return "Player 2 wins!🏅"
    } else {
        return "🤷🏻‍♀️It's a tie!🤷🏻‍♀️"
    }
}
document.querySelector("h1").innerHTML = getWinner()