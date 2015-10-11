/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Vector2 = require('vector2');
var wpm = 250;
var results, counter;

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Speed Reading!',
  body: 'Press select to get started.'
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

function splitWord(word) {
  var pivot = 1;
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

function spritzIt(textfield){
  var res = splitWord(results[counter]);
  textfield.text(res);
  counter++;
  setTimeout(function () { spritzIt(textfield); }, 1000);
}

main.on('click', 'select', function(e) {
  ajax({ url: 'https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1', type: 'json' }, function(data) {
    var wind = new UI.Window({
      fullscreen: true,
    });
    results = data[0].split(" ");
    var textfield = new UI.Text({
      position: new Vector2(0, 65),
      size: new Vector2(144, 30),
      font: 'gothic-24-bold',
      textAlign: 'center'
    });
    wind.add(textfield);
    wind.show();
    counter = 0;
    spritzIt(textfield);
  },
  function(error) {
    console.log('Error receiving reddit data.');  
    main.body("Could not download posts.\n\nShake to try refreshing again.");
  });
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});