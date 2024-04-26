'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapEvent; // create a global variable because we want to access map in that form submit fn

class workout {
  date = new Date(); //defiend as fields
  id = (Date.now() + '').slice(-10); // for dummy unique id

  constructor(coords, distance, duration) {
    // this will take in the data that is common in both the running and cycling classes
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

//child classes of workout object
class Running extends workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.Calcpace();
  }

  Calcpace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycle1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycle1); // here we will get all the data that we specified also the pace will be calculated in running and and speed will be calculated in cycling also if you look at the __proto__ of running that you will see the method calcpace and in __proto__ of cycling you will see calcspeed method amd even further of its _proto_ will have 'Workout'

//////////////////////////////////////////////////////////
///////////application architecture///////////
class App {
  #map; //private properties that are presented on all the intances created through this class
  #mapEvent;

  constructor() {
    // constructer fn is called whenever the page loads
    this._getPosition(); ///constructer method is called immediately when a new object is created from this class so we want the map when the page load so we will call that fn is the constructer.
    form.addEventListener('submit', this._newWorkout.bind(this)); // this._newWorkout is attached to an addEventListener fn it is called by addevent listener so here the this keyword will always point to the dom element that it is attached to and in this case its form element so we have to use bind method

    inputType.addEventListener('change', this._toggleElevationField); //here in the fn _toggleElevationField it doesn't matter what the this keyword will look like
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          //this,_loadMap will be treated as a function regular call not method call (its called by getCurrentPosition) and since this is a callback fn we are not calling it ourselves it is the .getCurrentPosition fn that will call that callback fn so remember that we studied in this case the this keyword set to undefined so we need to bind this keyword here using bind method
          alert('could not get postion');
        }
      );
    }
  }

  _loadMap(position) {
    // console.log(position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13); //here we assigned that map with this value we will use it in the form submit fn not here

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    console.log(this); // here this would've came undefined if we didnt bind the this keyword with loadMap fn

    this.#map.on('click', this._showForm.bind(this));

    // const { lat, lng } = mapEvent.latlng;
    // //console.log([lat, lng]);
    // L.marker([lat, lng])
    //   .addTo(map)
    //   .bindPopup(
    //     L.popup({
    //       maxWidth: 250,
    //       minWidth: 100,
    //       autoClose: false,
    //       closeOnClick: false,
    //       className: 'running-popup',
    //     })
    //   )
    //   .setPopupContent('workout')
    //   .openPopup();
  }

  _showForm(mapE) {
    this.#mapEvent = mapE; //here we assign the value of mapE to the global variable so that we can use it in the form handler fn
    // now we want to display form data when the user clicks on the map
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    // this fn does not use the this keyword anywhere therefore we dont need to bind where _toggleElevationField is called
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    //display marker
    const { lat, lng } = this.#mapEvent.latlng; //mapevent is also not present in the current scope
    //console.log([lat, lng]);
    //display marker
    L.marker([lat, lng])
      .addTo(this.#map) //we will use that global variable here because without that in this the map is in another function we cannot access it because we are trying to access a variable which is not in the current scope
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('workout')
      .openPopup();
  }
}

const app = new App();
