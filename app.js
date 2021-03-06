'use strict';

require('dotenv').config();

let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let socket = require('socket.io');

let port = process.env.PORT || 2000;
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let mongoose = require('mongoose');
let BookingModel = require('./src/models/Booking').model('Booking');
let RoomModel = require('./src/models/Room').model('Room');
let RoomHandler = require('./src/handlers/roomHandler');
let Room = new RoomHandler(RoomModel, BookingModel);

let ngrok = require('ngrok');

async function getPublicUrl() {
    console.log("Public url: " + await ngrok.connect(port));
}

getPublicUrl();

require('./src/config/database').initialize();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Setup grouprooms with LNUscraper
app.get('/setup-rooms', (req, res) => {
    let LNUscraper = require('./src/libs/setupLNUscraper');
    LNUscraper(RoomModel);
})

//Setup grouproom information
app.get('/setup-room-info', async function (req, res) {
    let scrape = require('./src/libs/infoScraper');
    let rooms = await Room.getRoomsFromDB();
    let promises = rooms.map((room, index) => {
        return new Promise(async (resolve, reject) => {
            let roomName = await scrape(room.name);
            resolve(roomName);
        })
    })

    Promise.all(promises)
        .then((groupRooms) => {
            for (let i = 0; i < groupRooms.length; i++) {
                if (groupRooms[i] !== undefined) {
                    RoomModel.findOne({ name: groupRooms[i].name }, function (err, result) {
                        result.equipment = groupRooms[i].equipment;
                        result.size = groupRooms[i].size;

                        result.save(function (err, data) {
                            if (err) {
                                console.log(err);
                            }
                        })
                    })
                }
            }
        }).catch((err) => {
            console.log(err);
        })
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/client/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let routes = require('./src/routes/routes')(RoomModel, BookingModel);
app.use('/', routes);

http.listen(port, function () {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});
