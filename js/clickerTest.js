/* Med document.queryselector(selector) kan vi hämta
 * de element som vi behöver från html dokumentet.
 * Vi spearar elementen i const variabler då vi inte kommer att
 * ändra dess värden.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * Viktigt: queryselector ger oss ett html element eller flera om det finns.
 */
const clickerButton = document.querySelector('#game-button');
const moneyTracker = document.querySelector('#money');
const mpsTracker = document.querySelector('#mps'); // money per second
const mpcTracker = document.querySelector('#mpc'); // money per click
const upgradesTracker = document.querySelector('#upgrades');
const upgradeList = document.querySelector('#upgradelist');
const msgbox = document.querySelector('#msgbox');
const audioAchievement = document.querySelector('#swoosh');



/* Följande variabler använder vi för att hålla reda på hur mycket pengar som
 * spelaren, har och tjänar.
 * last används för att hålla koll på tiden.
 * För dessa variabler kan vi inte använda const, eftersom vi tilldelar dem nya
 * värden, utan då använder vi let.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
 */
let money = 100;
let moneyPerClick = 1;
let currentMoneyPerClick = 1;
let currentClickMultiplier = 0;
let clickMultiplier = 0;
let moneyPerSecond = 0;
let acquiredUpgrades = 0;
let last = 0;
let numberOfClicks = 0; // hur många gånger har spelare eg. klickat
let active = false; // exempel för att visa att du kan lägga till klass för att indikera att spelare får valuta
let SpicyTonicActive = false;
//let SpicyTonicMultiplier = 1;
//let duration = 1000;



// likt upgrades skapas här en array med objekt som innehåller olika former
// av achievements.
// requiredSOMETHING är vad som krävs för att få dem

let achievements = [
    {
        description: 'Museet är redo att öppna, grattis! ',
        requiredUpgrades: 1,
        acquired: false,
    },
    {
        description: 'Nu börjar det likna något, fortsätt gräva!',
        requiredUpgrades: 10,
        acquired: false,
    },
    {
        description: 'Klickare, med licens att klicka!',
        requiredClicks: 10,
        acquired: false,
    },
    {
        description: 'Tac-2 god!',
        requiredClicks: 10000,
        acquired: false,
    },
];



/* Med ett valt element, som knappen i detta fall så kan vi skapa listeners
 * med addEventListener så kan vi lyssna på ett specifikt event på ett html-element
 * som ett klick.
 * Detta kommer att driva klickerknappen i spelet.
 * Efter 'click' som är händelsen vi lyssnar på så anges en callback som kommer
 * att köras vi varje klick. I det här fallet så använder vi en anonym funktion.
 * Koden som körs innuti funktionen är att vi lägger till moneyPerClick till
 * money.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */

clickerButton.addEventListener(
    'click',
    () => {
        moneyCalc();
        // vid click öka score med moneyPerClick
        money += Math.round(currentMoneyPerClick * (1+currentClickMultiplier));
        // håll koll på hur många gånger spelaren klickat
        numberOfClicks += 1;
        // console.log(clicker.score);
    },
    false
);



var moneyCalc = function() {
    if(moneyCalc.done) return;

    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].clicks) {
            currentMoneyPerClick += upgrades[i].currentClicks;            
        }
        if (upgrades[i].multiplier) {
            currentClickMultiplier += upgrades[i].currentMultiplier;
        }
    }

    console.log('Moneycalc executed.');
    console.log(currentMoneyPerClick + ', ' + currentClickMultiplier);

    moneyCalc.done = true;
};



/* För att driva klicker spelet så kommer vi att använda oss av en metod som heter
 * requestAnimationFrame.
 * requestAnimationFrame försöker uppdatera efter den refresh rate som användarens
 * maskin har, vanligtvis 60 gånger i sekunden.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 * funktionen step används som en callback i requestanaimationframe och det är
 * denna metod som uppdaterar webbsidans text och pengarna.
 * Sist i funktionen så kallar den på sig själv igen för att fortsätta uppdatera.
 */
function step(timestamp) {
    moneyTracker.textContent = Math.round(money);
    mpsTracker.textContent = moneyPerSecond;
    mpcTracker.textContent = currentMoneyPerClick;
    upgradesTracker.textContent = acquiredUpgrades;

    if (timestamp >= last + 1000) {
        money += moneyPerSecond;
        last = timestamp;
    }

    if (moneyPerSecond > 0 && !active) {
        mpsTracker.classList.add('active');
        active = true;
    }

    if (upgrades[5].effectActive && upgrades[5].activeDuration != 0) {
        upgrades[5].currentAdder = upgrades[5].adder;
    } else {
        upgrades[5].currentAdder = 0;
    }

    if (upgrades[4].effectActive && upgrades[4].activeDuration != 0) {
        upgrades[4].currentMultiplier = upgrades[4].multiplier;
    } else {
        upgrades[4].currentMultiplier = 0;
    }

    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].effectActive && upgrades[i].activeDuration > 0) {
            upgrades[i].activeDuration--;
            //console.log(upgrades[i].activeDuration);
        } else {
            upgrades[i].activeDuration = upgrades[i].duration;
            upgrades[i].effectActive = false;
        }
    }



    // achievements, utgår från arrayen achievements med objekt
    // koden nedan muterar (ändrar) arrayen och tar bort achievements
    // som spelaren klarat
    // villkoren i första ifsatsen ser till att achivments som är klarade
    // tas bort. Efter det så kontrolleras om spelaren har uppfyllt kriterierna
    // för att få den achievement som berörs.
    achievements = achievements.filter((achievement) => {
        if (achievement.acquired) {
            return false;
        }
        if (
            achievement.requiredUpgrades &&
            acquiredUpgrades >= achievement.requiredUpgrades
        ) {
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        } else if (
            achievement.requiredClicks &&
            numberOfClicks >= achievement.requiredClicks
        ) {
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        }
        return true;
    });

    window.requestAnimationFrame(step);
}



/* Här använder vi en listener igen. Den här gången så lyssnar iv efter window
 * objeket och när det har laddat färdigt webbsidan(omvandlat html till dom)
 * När detta har skett så skapar vi listan med upgrades, för detta använder vi
 * en forEach loop. För varje element i arrayen upgrades så körs metoden upgradeList
 * för att skapa korten. upgradeList returnerar ett kort som vi fäster på webbsidan
 * med appendChild.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * Efter det så kallas requestAnimationFrame och spelet är igång.
 */
window.addEventListener('load', (event) => {
    createUpgrades();
    /*upgrades.forEach((upgrade) => {
        upgradeList.appendChild(createCard(upgrade));
    });*/
    window.requestAnimationFrame(step);
});

const createUpgrades = () => {
    upgradeList.innerHTML = "";
    upgrades.forEach((upgrade) => {
        upgradeList.appendChild(createCard(upgrade));
    });
}

/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
upgrades = [
    {
        name: 'Incense Ingredients',
        description: '',
        cost: 1,
        clicks: 1,
        currentClicks: 0,
    },
    {
        name: 'Better Bottles',
        description: '',
        cost: 10,
        amount: 1,
    },
    {
        name: 'Quality Cauldrons',
        description: '',
        cost: 10,
        amount: 10,
    },
    {
        name: 'Furnace upgrade',
        description: '',
        cost: 1000,
        amount: 100,
    },
    {
        name: 'Spicy Tonic',
        description: 'Multiplies clicks for a short duration.  Current click multiplier is ',
        cost: 1,
        duration: 300,
        activeDuration: 0,
        effectActive: false,
        multiplier: 0.1,
        currentMultiplier: 0,
    },
    {
        name: 'Stoutness Potion',
        description: 'Boosts clicks for a short duration.  Current click buff is +',
        cost: 1,
        duration: 600,
        activeDuration: 0,
        effectActive: false,
        adder: 3,
    },
    {
        name: 'Potion Belt',
        description: 'Potion effects duration increased. Current potion duration buff is +',
        cost: 1,
        effectActive: false,
        durationIncrease: 1, // in seconds
    },
    {
        name: 'Wabuu Keychain',
        description: 'Increases positive effects and reduces shop prices with 1%. Current buff is ',
        cost: 1,
        effectActive: false,
        multiPositive: 0.01,
        currentMultiPositive: 0,
        priceReduc: 0.01,
        currentPriceReduc: 0,
    }
];



/* createCard är en funktion som tar ett upgrade objekt som parameter och skapar
 * ett html kort för det.
 * För att skapa nya html element så används document.createElement(), elementen
 * sparas i en variabel så att vi kan manipulera dem ytterligare.
 * Vi kan lägga till klasser med classList.add() och text till elementet med
 * textcontent = 'värde'.
 * Sedan skapas en listener för kortet och i den hittar vi logiken för att köpa
 * en uppgradering.
 * Funktionen innehåller en del strängar och konkatenering av dessa, det kan göras
 * med +, variabel + 'text'
 * Sist så fäster vi kortets innehåll i kortet och returnerar elementet.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
 */
function createCard(upgrade) {
    const card = document.createElement('div');
    card.classList.add('card');
    const header = document.createElement('p');
    header.classList.add('title');
    const cost = document.createElement('p');
    if (upgrade.amount) {
        header.textContent = `${upgrade.name}, +${upgrade.amount} per sekund.`;
    } else if (upgrade.clicks) {
        header.textContent = `${upgrade.name}, +${upgrade.clicks} per klick.`;
    } else if (upgrade.adder){
        header.textContent = `${upgrade.name}, ${upgrade.description}${upgrade.adder} clicks.`;
    } else if (upgrade.durationIncrease) {
        header.textContent = `${upgrade.name}, ${upgrade.description}${upgrade.durationIncrease} seconds.`;
    } else if (upgrade.multiplier) {
        header.textContent = `${upgrade.name}, ${upgrade.description}${Math.round((1+upgrade.multiplier)*100)}%.`;
    } else {
        header.textContent = `${upgrade.name}, ${upgrade.description}${Math.ceil((1+upgrade.currentMultiPositive)*100)}%.`;
    }
    cost.textContent = `Köp för ${upgrade.cost} Guld.`;

    card.addEventListener('click', (e) => {
        if (money >= upgrade.cost) {
            moneyCalc.done = false;
            if (upgrade.duration) {
                /*for (let i = 0; i < upgrades.length; i++) {
                    upgrades[i].effectActive = true;
                }*/
                if (upgrade.multiplier) {
                    upgrade.effectActive = true;
                    console.log(upgrade.multiplier);
                }
                if (upgrade.adder) {
                    currentMoneyPerClick = moneyPerClick + upgrade.adder;
                    upgrade.effectActive = true;
                    console.log(currentMoneyPerClick);
                }
                upgrades.activeDuration = upgrades.duration;
            } else if (upgrade.durationIncrease) {
                for (let i = 0; i < upgrades.length; i++) {
                    upgrades[i].duration = upgrades[i].duration + upgrade.durationIncrease*60;
                    console.log(upgrades[i].duration);
                }
            } else if (upgrade.multiPositive) {
                upgrade.currentMultiPositive = upgrade.multiPositive + upgrade.currentMultiPositive;
                upgrade.currentPriceReduc = upgrade.priceReduc + upgrade.currentPriceReduc;
                for (let i = 0; i < upgrades.length; i++) {
                    upgrades[i].duration = upgrades[i].duration * (1+upgrade.currentMultiPositive);
                    upgrades[i].cost -= upgrades[i].cost * upgrade.currentPriceReduc;
                }
                console.log(upgrade.currentMultiPositive);
            } else {
                moneyPerSecond += upgrade.amount ? upgrade.amount : 0;
                upgrade.currentClicks += upgrade.clicks ? upgrade.clicks : 0;
            }
            acquiredUpgrades++;
            money -= upgrade.cost;
            upgrade.cost *= 1.5;
            cost.textContent = 'Köp för ' + upgrade.cost + ' Guld';
            message('Grattis du har köpt en uppgradering!', 'success');
            createUpgrades();
        }
         else {
            message('Du har inte råd.', 'warning');
        }
    });

    card.appendChild(header);
    card.appendChild(cost);
    return card;
}



/* Message visar hur vi kan skapa ett html element och ta bort det.
 * appendChild används för att lägga till och removeChild för att ta bort.
 * Detta görs med en timer.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 */
function message(text, type) {
    const p = document.createElement('p');
    p.classList.add(type);
    p.textContent = text;
    msgbox.appendChild(p);
    if (type === 'achievement') {
        audioAchievement.play();
    }
    setTimeout(() => {
        p.parentNode.removeChild(p);
    }, 2000);
}