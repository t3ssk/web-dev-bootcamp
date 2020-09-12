let buttonColours = ["green", "red", "yellow", "blue"];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let keypressed = false


//přiřadí ke každému tlačítku přiřadí zvuk
const sound = (color) => {
    let audio = new Audio (`sounds/${color}.mp3`);
    audio.play()
   
}


//zjistí, jestli už hra začala
$('body').on('keypress', function(e){
    if (keypressed) return
    keypressed = true
    newSequence() 
    

})

//po kliknutí
$(".btn").on('mousedown',function(){
    
    let userChosenColour =  $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    sound(userChosenColour)
    animatePress (userChosenColour)
    checkIfSame (userClickedPattern.length-1)
})

//nová sekvence
const newSequence = () => {
    const randomNum = Math.floor(Math.random()*3);
    const randomChosenColour = buttonColours[randomNum];
    gamePattern.push(randomChosenColour);
    //blikání
    $(`#${randomChosenColour}`).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
    sound(randomChosenColour)
    level ++;
    nextLevel()



}
//animace tlačítka - přidá a odebere se stín
function animatePress (currentColour) {
   
            $(`.${currentColour}`).addClass('pressed');
            setTimeout (function(){
                $(`.${currentColour}`).removeClass('pressed');
            }, 100)
        
    
}
//změní h1
function nextLevel()
{if (!keypressed) {
    $('h1').text('Press A Key to Start')
} else if (level!==0) {
    $('h1').text(`Level ${level}`)
}
}

//zkontroluje jestli je sequence stejná

function checkIfSame (currentLevel) {
    
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]){
        if(userClickedPattern.length === gamePattern.length){

                setTimeout(newSequence(), 1000)
                userClickedPattern = []
        }
    } 
    else { 
        let audioWrong = new Audio('sounds/wrong.mp3')
        audioWrong.play()
        $('body').addClass('game-over')
        setTimeout(function(){$('body').removeClass('game-over')}, 200)
        $('h1').text('Game over, press any key to restart')
        startOver()
        }
}

function startOver(){
    level = 0;
    keypressed = false;
    userClickedPattern = [];
    gamePattern = [];
}



