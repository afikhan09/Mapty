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

class App {
  #map; //private properties that are presented on all the intances created through this class
  #mapEvent;

  constructor() {
    // constructer fn is called whenever the page loads
    this._getPosition(); ///constructer method is called immediately when a new object is created from this class so we want the map when the page load so we will call that fn is the constructer.
    form.addEventListener('submit', this._newWorkout.bind(this)); // this._newWorkout is attached to an addEventListener fn it is called by addevent listener so here the this keyword will always point to the dom element that it is attached to and in this case its form element so we have to use bind method

    inputType.addEventListener('change', function () {
      inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    });
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

  _toggleElevationField() {}

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
