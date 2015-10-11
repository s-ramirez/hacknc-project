/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var wpm = 200;
var results, counter;

var main = new UI.Card({
  title: 'Vite',
  icon: 'images/main_iconx1.png',
  subtitle: 'Welcome!',
  body: 'Speed proof your reading abilities.'
});

main.show();

var news_window = new UI.Menu();
news_window.section(0, {title: 'Today', items: []});

main.on('click', 'select', function(e) {
  ajax({ url: 'https://www.googleapis.com/books/v1/volumes?q=classic', type: 'json' },
     function(data) {
       data = data.items;
       var all_news = [];
       for(var i = 0; i < data.length; i++) {
         var content = data[i].volumeInfo.description;
         all_news.push({title: data[i].volumeInfo.title, subtitle: data[i].volumeInfo.authors ? data[i].volumeInfo.authors[0] : 'None', body: content });
         console.log("Content: "+content);
       }
       news_window.items(0, all_news);
       main.hide();
       news_window.show();
  });
});

function splitWord(word) {
  var pivot = 1;
  if(word) {
    switch (word.length) {
      case 0:
      case 1:
        pivot = 0;
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        pivot = 1;
        break;
      case 6:
      case 7:
      case 8:
      case 9:
        pivot = 2;
        break;
      case 10:
      case 11:
      case 12:
      case 13:
        pivot = 3;
        break;
      default:
        pivot = 4;
    }
    return [word.substring(0, pivot), word.substring(pivot, pivot + 1), word.substring(pivot + 1)];
  }
  return ['','',''];
}

function spritzIt(textfield){
  var res = splitWord(results[counter]);
  var l0=res[0].length;
  var l2=res[2].length;
  
  textfield.position(new Vector2(((144-(l0*3)-(l2*3)-3)/2)-l0*3, 65));
  textfield.text(res[0]+res[1]+res[2]);
  counter++;
  setTimeout(function () { spritzIt(textfield); }, 60000/wpm);
}

news_window.on('select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  console.log("body "+e.item.body);
  results = e.item.body.split(" ");
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    textAlign: 'left'
  });
  var textfield_top = new UI.Text({
    position: new Vector2(0, 45),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    textAlign: 'center',
    text: '|'
  });
  var textfield_bottom = new UI.Text({
    position: new Vector2(0, 85),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    textAlign: 'center',
    text: '|'
  });
  wind.add(textfield);
  wind.add(textfield_top);
  wind.add(textfield_bottom);
    
  wind.on('click','up',function(e){
    wpm +=50;
  });  
  
  wind.on('click','down',function(e){
    if(wpm > 50) {
      wpm -=50;
    }
  });
  
  wind.show();
  counter = 0;
  spritzIt(textfield);
});