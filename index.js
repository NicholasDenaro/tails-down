function init(){
	console.log('test');
	let gyroscope = new RelativeOrientationSensor({
	//let gyroscope = new Gyroscope({
		frequency: 60,
		referenceFrame: 'device',
	});
	const mat4 = new Float32Array(16);
	let tilt = 0;
	gyroscope.onreading = () => {
		//console.log(gyroscope);
		//console.log('val');
		gyroscope.populateMatrix(mat4);
		document.getElementById('gyro').innerText = Math.round(mat4[10] * 100) / 100;
		//document.getElementById('gyro').innerText = `x: ${gyroscope.x}, y: ${gyroscope.y}, z: ${gyroscope.z}`;
		//document.getElementById('gyro').innerText = Math.round(tilt * 100) / 100;
		//gyroscope.populateMatrix(mat4);
		
		let tiltval = mat4[10];
		if (tiltval > -0.2 && tiltval < 0.2) {
			debounce = false;
			hideAnswer();
		}
		
		if (playing && !debounce) {
			if (tiltval > 0.8) {
				//setTimeout(clearDebounce, 1000);
				incorrect();
				debounce = true;
			}
			if (tiltval < -0.8) {
				//setTimeout(clearDebounce, 1000);
				correct();
				debounce = true;
			}
		}
	};
	
	gyroscope.onerror = err => console.log(err);
	gyroscope.onactivate = e => {console.log('active');
console.log(e); 
				     //alert('gryo active');
				    };
	console.log(gyroscope);
	let started = gyroscope.start();
	console.log(gyroscope);
}

function hideAnswer() {
	const ans = document.getElementById('answer');
	ans.className = 'answer-hide';
}

function showCorrect() {
	const ans = document.getElementById('answer');
	ans.children[0].innerText = 'Correct'
	ans.className = 'answer-correct';
}

function showPass() {
	const ans = document.getElementById('answer');
	ans.children[0].innerText = 'Pass';
	ans.className = 'answer-pass';
}

let debounce = false;
function clearDebounce() {
	debounce = false;
}

function addCategory(name, words) {
	let box = document.createElement('div');
	let boxText = document.createElement('div');
	boxText.style.margin = 'auto';
	box.appendChild(boxText);
	boxText.innerText = name;
	boxText.onclick = () => {
		cardList = [...words];
		startCountdown();
	}
	box.id = name;
	box.className = "category";
	box.style.backgroundColor = 'blue';
	document.getElementById('categories').appendChild(box);
}

function showCategories() {
	document.getElementById('categories').style.display = "flex";
	document.getElementById('playing').style.display = "none";
	document.getElementById('summary').style.display = "none";
}

function showCountdown() {
	document.getElementById('categories').style.display = "none";
	document.getElementById('countdown').style.display = "flex";
}

function showCards() {
	document.getElementById('categories').style.display = "none";
	document.getElementById('countdown').style.display = "none";
        document.getElementById('playing').style.display = "flex";
	document.getElementById('summary').style.display = "none";
}

function showSummary() {
	document.getElementById('categories').style.display = "none";
	document.getElementById('playing').style.display = "none";
	document.getElementById('summary').style.display = "flex";
}

let countinterval;
let countdown = 3;
function startCountdown() {
	showCountdown();
	countdown = 3;
	timeout = setTimeout(() => {
		startRound();
	}, 3 * 1000);
	document.getElementById("countdown").children[0].innerText = 
countdown;
	countinterval = setInterval(() => {
		countdown--;
		document.getElementById("countdown").children[0].innerText 
= countdown;
		if (countdown == 0) clearInterval(countinterval);
	}, 1000);
}

let playing = false;
let interval;
let timeout;
let percent = 100;
let guesses = [
{card: 'blah', correct: true},
{card: 'bla2', correct: false}
];
let cardList = [];
function startRound() {
	timeout = setTimeout(() => endRound(), 60 * 1000);
	percent = 100;
	interval = setInterval(() => {
		percent -= 100 / (60 * 1000 / 100);
		document.getElementById('timer').style.height = 
`${percent}%`;
	}, 100);

	playing = true;
	debounce = false;
	hideAnswer();
	//guesses = [{card: cardList.splice(Math.floor(Math.random() * cardList.length), 1)[0]}];
	//document.getElementsByClassName('card')[0].children[0].innerText = guesses[0].card;
	guesses = [];	
	nextCard();
	showCards();
}

function correct() {
	guesses.at(-1).correct = true;
	nextCard();
	showCorrect();
}

function incorrect() {
	nextCard();
	showPass();
}

function nextCard() {
	if (cardList.length == 0) {
		endRound();
		return;
	}
	guesses.push({card: cardList.splice(Math.floor(Math.random() * 
cardList.length), 1)});
	document.getElementsByClassName('card')[0].children[0].innerText =
guesses.at(-1).card;
}

function endRound() {
	clearTimeout(timeout);
	timeout = null;
	clearInterval(interval);
	interval = null;
	console.log('round end');
	document.getElementById('summary-count').innerText = 
`${guesses.filter(g => g.correct).length}/${guesses.length}`;
	document.getElementById('summary-recap').innerHTML = '';
	guesses.forEach(guess => {
		let word = document.createElement('div');
		word.className = guess.correct ? 'correct' : 'incorrect'
		word.innerText = guess.card;
document.getElementById('summary-recap').appendChild(word);
		
	});
	playing = false;
	showSummary();
}



function loadCategories() {
showCategories();
addCategory("Animals", animalsList);
addCategory("Jobs", jobsList);
addCategory("Fast Food Chains", fastFoodList);
addCategory("Video Game Characters", videogameCharactersList);
addCategory("OG Pokemon", ogPokemonList);
addCategory("Office Talk", officeList);
addCategory("Celebrities", celebritiesList);
addCategory("Snacks", snacksList);
}

Promise.all([
//window.navigator.permissions.query({name:'accelerometer'}),
//window.navigator.permissions.query({name:'magnetometer'}),
window.navigator.permissions.query({name:'gyroscope'})
]).then(permissions => 
{
console.log(permissions);
console.log('start');
init();

});

const ogPokemonList = [
'Bulbasaur',
'Ivysaur',
'Venusaur',
'Charmander',
'Charmeleon',
'Charizard',
'Squirtle',
'Wartortle',
'Blastoise',
'Caterpie',
'Metapod',
'Butterfree',
'Weedle',
'Kakuna',
'Beedrill',
'Pidgey',
'Pidgeotto',
'Pidgeot',
'Rattata',
'Raticate',
'Spearow',
'Fearow',
'Ekans',
'Arbok',
'Pikachu',
'Raichu',
'Sandshrew',
'Sandslash',
'Nidoran♀',
'Nidorina',
'Nidoqueen',
'Nidoran♂',
'Nidorino',
'Nidoking',
'Clefairy',
'Clefable',
'Vulpix',
'Ninetales',
'Jigglypuff',
'Wigglytuff',
'Zubat',
'Golbat',
'Oddish',
'Gloom',
'Vileplume',
'Paras',
'Parasect',
'Venonat',
'Venomoth',
'Diglett',
'Dugtrio',
'Meowth',
'Persian',
'Psyduck',
'Golduck',
'Mankey',
'Primeape',
'Growlithe',
'Arcanine',
'Poliwag',
'Poliwhirl',
'Poliwrath',
'Abra',
'Kadabra',
'Alakazam',
'Machop',
'Machoke',
'Machamp',
'Bellsprout',
'Weepinbell',
'Victreebel',
'Tentacool',
'Tentacruel',
'Geodude',
'Graveler',
'Golem',
'Ponyta',
'Rapidash',
'Slowpoke',
'Slowbro',
'Magnemite',
'Magneton',
'Farfetch\'d',
'Doduo',
'Dodrio',
'Seel',
'Dewgong',
'Grimer',
'Muk',
'Shellder',
'Cloyster',
'Gastly',
'Haunter',
'Gengar',
'Onix',
'Drowzee',
'Hypno',
'Krabby',
'Kingler',
'Voltorb',
'Electrode',
'Exeggcute',
'Exeggutor',
'Cubone',
'Marowak',
'Hitmonlee',
'Hitmonchan',
'Lickitung',
'Koffing',
'Weezing',
'Rhyhorn',
'Rhydon',
'Chansey',
'Tangela',
'Kangaskhan',
'Horsea',
'Seadra',
'Goldeen',
'Seaking',
'Staryu',
'Starmie',
'Mr. Mime',
'Scyther',
'Jynx',
'Electabuzz',
'Magmar',
'Pinsir',
'Tauros',
'Magikarp',
'Gyarados',
'Lapras',
'Ditto',
'Eevee',
'Vaporeon',
'Jolteon',
'Flareon',
'Porygon',
'Omanyte',
'Omastar',
'Kabuto',
'Kabutops',
'Aerodactyl',
'Snorlax',
'Articuno',
'Zapdos',
'Moltres',
'Dratini',
'Dragonair',
'Dragonite',
'Mewtwo',
'Mew',
];

const animalsList = [
	'alligator',
	'ant',
	'bear',
	'bee',
	'bird',
	'butterfly',
	'camel',
	'cat',
	'cheetah',
	'chicken',
	'cow',
	'crocodile',
	'deer',
	'dog',
	'dolphin',
	'duck',
	'eagle',
	'elephant',
	'fish',
	'flamingo',
	'fox',
	'frog',
	'giraffe',
	'goat',
	'hamster',
	'hippo',
	'horse',
	'kangaroo',
	'koala',
	'lion',
	'lizard',
	'monkey',
	'mouse',
	'octopus',
	'owl',
	'panda',
	'parrot',
	'penguin',
	'pig',
	'rabbit',
	'rhino',
	'seal',
	'shark',
	'sheep',
	'snake',
	'spider',
	'squirrel',
	'tiger',
	'turtle',
	'zebra',
];

const fastFoodList = [
	'Burger King',
	'McDonald\'s',
	'KFC',
	'Subway',
	'Pizza Hut',
	'Domino\'s',
	'Taco Bell',
	'Wendy\'s',
	'Starbucks',
	'Dunkin\' Donuts',
	'Chick-fil-A',
	'Popeyes',
	'Chipotle',
	'Panera Bread',
	'Five Guys',
	'Shake Shack',
	'In-N-Out',
	'Arby\'s',
	'Sonic',
	'Hardee\'s',
	'Carl\'s Jr.',
	'Jack in the Box',
	'Whataburger',
	'Quiznos',
	'Jimmy John\'s',
	'Panda Express',
	'Little Caesars',
	'Dairy Queen',
	'Cinnabon',
	'Krispy Kreme',
	'Auntie Anne\'s',
	'Tim Hortons',
	'White Castle',
	'Long John Silver\'s',
	'Del Taco',
	'Bojangles\'',
	'Church\'s Chicken',
	'Zaxby\'s',
	'Raising Cane\'s',
	'Wingstop',
	'Jamba Juice',
	'Smoothie King',
	'Cold Stone Creamery',
	'Baskin-Robbins',
	'Pinkberry',
	'Nando\'s',
	'Pret A Manger',
	'Greggs',
	'Costa Coffee',
	'Cafe Nero',
];

const jobsList = [
	'accountant',
	'actor',
	'architect',
	'artist',
	'astronaut',
	'athlete',
	'baker',
	'barber',
	'biologist',
	'builder',
	'chef',
	'chemist',
	'clerk',
	'coach',
	'dentist',
	'designer',
	'doctor',
	'driver',
	'editor',
	'engineer',
	'farmer',
	'firefighter',
	'florist',
	'gardener',
	'journalist',
	'judge',
	'lawyer',
	'librarian',
	'mechanic',
	'musician',
	'nurse',
	'painter',
	'pharmacist',
	'photographer',
	'pilot',
	'plumber',
	'poet',
	'police',
	'singer',
	'soldier',
	'teacher',
	'therapist',
	'translator',
	'veterinarian',
	'waiter',
	'writer',
	'yoga instructor',
	'zoologist',
];

const videogameCharactersList = [
	'Mario',
	'Luigi',
	'Peach',
	'Bowser',
	'Link',
	'Zelda',
	'Ganondorf',
	'Samus',
	'Kirby',
	'Donkey Kong',
	'Sonic',
	'Tails',
	'Knuckles',
	'Eggman',
	'Crash',
	'Spyro',
	'Lara Croft',
	'Nathan Drake',
	'Master Chief',
	'Cortana',
	'Solid Snake',
	'Cloud',
	'Sephiroth',
	'Aerith',
	'Kratos',
	'Geralt',
	'Triss',
	'Ciri',
	'Ezio',
	'Altair',
	'Lara Croft',
	'Joel',
	'Ellie',
	'Aloy',
	'Arthur Morgan',
	'John Marston',
	'Dutch',
	'CJ',
	'Niko',
	'Trevor',
	'Michael',
	'Franklin',
	'Gordon Freeman',
	'Alyx',
	'Chell',
	'GLaDOS',
	'Wheatley',
	'Commander Shepard',
	'Garrus',
	'Liara',
];

const officeList = [
'Desk',
'Chair',
'Computer',
'Keyboard',
'Mouse',
'Monitor',
'Printer',
'Scanner',
'Copier',
'Fax machine',
'Phone',
'Headset',
'Webcam',
'Microphone',
'Speakers',
'Lamp',
'Clock',
'Calendar',
'Pen',
'Pencil',
'Eraser',
'Sharpener',
'Highlighter',
'Marker',
'Stapler',
'Paper clip',
'Rubber band',
'Binder clip',
'Tape',
'Glue',
'Scissors',
'Ruler',
'Calculator',
'Notebook',
'Paper',
'Envelope',
'Folder',
'File cabinet',
'Drawer',
'Trash can',
'Recycling bin',
'Shredder',
'Coffee maker',
'Mug',
'Water bottle',
'Snack',
'Plant',
'Picture frame',
'Book',
'Magazine',
];

const celebritiesList = [
  "Beyoncé",
  "Tom Cruise",
  "Oprah Winfrey",
  "Barack Obama",
  "Taylor Swift",
  "Brad Pitt",
  "Emma Watson",
  "Elon Musk",
  "Rihanna",
  "Leonardo DiCaprio",
  "Ellen DeGeneres",
  "Justin Bieber",
  "Kim Kardashian",
  "Dwayne Johnson",
  "Ariana Grande",
  "Bill Gates",
  "Angelina Jolie",
  "Johnny Depp",
  "Jennifer Lopez",
  "Will Smith",
  "Lady Gaga",
  "Robert Downey Jr.",
  "Drake",
  "Selena Gomez",
  "Keanu Reeves",
  "Meryl Streep",
  "Ed Sheeran",
  "Katy Perry",
  "Daniel Radcliffe",
  "Emma Stone",
  "BTS",
  "Madonna",
  "George Clooney",
  "Stephen Curry",
  "Serena Williams",
  "Lionel Messi",
  "Cristiano Ronaldo",
  "LeBron James",
  "Roger Federer",
  "Usain Bolt",
  "Michael Jordan",
  "Michelle Obama",
  "Malala Yousafzai",
  "Dalai Lama",
  "Nelson Mandela",
  "Albert Einstein",
  "William Shakespeare",
  "Marilyn Monroe",
  "Elvis Presley",
  "Michael Jackson"
];

const snacksList = ["Chips","Popcorn","Pretzels","Crackers","Cheese","Nuts","Trail mix","Granola bar","Energy bar","Protein bar","Cookie","Brownie","Muffin","Cake","Pie","Donut","Croissant","Scone","Bread","Butter","Jam","Peanut butter","Jelly","Nutella","Fruit","Apple","Banana","Orange","Grape","Berry","Vegetable","Carrot","Celery","Cucumber","Tomato","Dip","Hummus","Guacamole","Salsa","Yogurt","Ice cream","Popsicle","Smoothie","Milkshake","Chocolate","Candy","Gummy","Jelly bean","Marshmallow","Cereal"];

