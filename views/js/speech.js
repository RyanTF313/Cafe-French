var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
let recognition = new SpeechRecognition();
let speechRecognitionList = new SpeechGrammarList();
var say = window.speechSynthesis;
let sayThis;
var voices = [];
const start = document.querySelector('.start');
const cashier = document.querySelector('.cashier');
const output = document.querySelector('.output');
const grammar = '#JSGF V1.0';
let newOrder;
// ;grammar orders; public <orders> = ' + orders.join(' | ') +  ';';

speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
// recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


class App {
  constructor() {
    this.order = {
      //for details of each order (used later to create receipt)
      'name': '',
      'drink': '',
      'flavor': '',
      'size': '',
      'pastrie': []
    },
    this.menu = {
      //for selections of each order
      'drinks': ['coffee', 'espresso', 'latte', 'machiatto', 'cappucino', 'hot chocolate', 'cider', 'tea'],
      'sizes': ['large', 'medium', 'small', 'double', 'single', 'triple'],
      'flavors': ['mocha', 'caramel', 'vanilla', 'pumpkin spice', 'hazelnut'],
      'pastrie': ['croissant', 'danish', 'donut']
    },
    //keep track of place of order
    this.place = 0
  }

  next(){
    //moves app along to next place
    this.place ++
  }

  checkPlace(){
    //always check place of order before running
    this.run(this.place)
  }

  run(num){
    //run app from place
    if (num === 0) {
      //from place 0 / name
      recognition.stop();
      cashier.innerHTML = 'Hello! Welcome to Cafe French, may I have your name?';
    }else if (num === 1) {
      //from place 1 / drink
      recognition.stop();
      cashier.innerHTML = 'What would you like to drink?';
    }
    //start speaking
    this.speak(this);
  }

  speak(order){
    //speak to customer
    //get device voices
    voices = say.getVoices();
    //establish speech instance and where to get what to say
    sayThis = new SpeechSynthesisUtterance(cashier.innerHTML);
    //control speech volume
    sayThis.volume = 0.8;
    //get voice from array of voices (on mac this is google female voice)
    sayThis.voice = voices[48];
    //say what is in cashier.innerHTML
    say.speak(sayThis);
    //start recognition after 3.5secs
    setTimeout(()=> recognition.start(), 3500)
    //start listening after 3.75secs
    setTimeout(()=> this.listen(order), 3750)
  }
  //use function syntacs

  listen(order){
    //listen to customer
    recognition.addEventListener('result', (event)=> {
      let transcript = event.results[0][0].transcript;
      output.innerHTML = transcript;
      setTimeout(()=>this.confirm(transcript, order), 2000);
    });
  }
  getName(order){
    recognition.stop();
    //if it is correct and place is at 0 add name to order object
    order['order'].name = output.innerHTML;
    setTimeout(()=> this.next(),2000);
    setTimeout(()=>this.checkPlace(),2200)
  }
  getDrink(order){
    recognition.stop();
    //if it is correct and place is at 0 add name to order object
    order['order'].drink = output.innerHTML;
    setTimeout(()=> this.next(),2000);
    setTimeout(()=>this.checkPlace(),2200)
  }
  stop(){
    recognition.stop();
    cashier.innerHTML = 'Thank you for coming to Cafe French!';
  }

  confirm(output, order){
    document.querySelector('.question').style.display = "block";
    document.querySelectorAll('.confirm input').forEach(
      (checkbox)=>{
        checkbox.addEventListener('click', ()=>{
          if (checkbox.value == 'true') {
            switch(this.place) {
              case 0:
              this.getName(order)
              break;
              case 1:
              this.getDrink(order)
              break;
            }
          }else {
            cashier.innerHTML = "Sorry can you repeat that?";
            this.speak(this)
          }
        })
      }
    )
  };
}

start.addEventListener('click', ()=>{
  newOrder = new App();
  newOrder.checkPlace()
});
