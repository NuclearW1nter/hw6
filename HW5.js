
class Diablo_Character_Data
{
    constructor(data)
    {
        this.D3_data = data;
        for (let iter in this.D3_data){
            if (iter === "heroes"){
                this.D3_heroes = this.D3_data[iter];
            }
        }
    }
    CharacterMap()
    {
        var characterMap = new Map();
        var charID;
        var charName;
        for (let iter in this.D3_heroes){
            for(let iterator in this.D3_heroes[iter]){
                if (iterator === "id"){
                    charID = this.D3_heroes[iter][iterator];
                }
                else if (iterator === "name"){
                    charName = this.D3_heroes[iter][iterator];
                }
            }
            characterMap.set(charID,charName);
        }
        return characterMap
    }
    LastPlayed()
    {
        var lastTime = [];
        var playMap =  new Map();
        var lastThree;
        var tempid;
        for (let iter in this.D3_heroes){
            for(let iterator in this.D3_heroes[iter]){
                if (iterator === "id"){
                    tempid = this.D3_heroes[iter][iterator];
                }
                else if (iterator === "last-updated"){
                    lastTime.push(this.D3_heroes[iter][iterator]);
                    playMap.set(this.D3_heroes[iter][iterator],tempid);
                }
            }
        }
        lastTime.sort(function (a,b) {
            return a - b;
        });
        lastTime.reverse();
        lastThree = lastTime.slice(0,3);
        let notLastThree = lastTime.slice(3);
        notLastThree.forEach(x => playMap.delete(x))
        return playMap;
    }
    MostPlayed()
    {
        var classMostPlayed;
        var currentMostPlayed;
        var tempClass;
        for (let iter in this.D3_data["seasonalProfiles"]["season0"]["timePlayed"]){
            if (iter === "barbarian"){
                classMostPlayed = iter;
                currentMostPlayed = this.D3_data["seasonalProfiles"]["season0"]["timePlayed"][iter];
            }
            else{
                tempClass = this.D3_data["seasonalProfiles"]["season0"]["timePlayed"][iter];
                if (tempClass >= currentMostPlayed){
                    currentMostPlayed = tempClass;
                    classMostPlayed = iter;
                }
            }
        }
        return classMostPlayed;
    }
}

class HeroData{
    constructor(data){
        this.characterData = data;
    }
    GeneralInfo(){
        var infoList = [];;
        var infoHeaders = [];
        for (let iter in this.characterData){
            if (iter === "kills"){
                infoHeaders.push(iter);
                infoList.push(this.characterData[iter]["elites"]);
            }
            else{
                infoHeaders.push(iter);
                infoList.push(this.characterData[iter]);
            }
        }
        infoList = infoList.slice(0,10);
        infoHeaders = infoHeaders.slice(0,10);
        var retrunArray =[];
        retrunArray.push(infoHeaders);
        retrunArray.push(infoList);
        return retrunArray;
    }
}

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const firebase = require("firebase");
var rawUserData;
var rawHeroData;
var username;

var config = {
    apiKey: "AIzaSyBmZQF4USrZKDDbGlVjx_S4oiIBpPDvnGY",
    authDomain: "swe-project-hw.firebaseapp.com",
    databaseURL: "https://swe-project-hw.firebaseio.com",
    projectId: "swe-project-hw",
    storageBucket: "swe-project-hw.appspot.com",
    messagingSenderId: "382894996954"
};
firebase.initializeApp(config);

var database = firebase.database();

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.get('/', function (req,res){
    res.send("Please get your Diablo 3 account's username and number and got to /user/(your username)-#### ");
});
app.route('/user/:userid')
    .all(function (req,res,next) {
        promise = new Promise(function (resolve,reject) {
            username = req.params.userid;
            var url = 'https://us.api.battle.net/d3/profile/' + username + '/?locale=en_US&apikey=twqr2eysu74xn7ezw9a68tsf3wyub25x';
            fetch(url)
                .then((res) =>{
                    return res.json();
                }).then((json) => {
                rawUserData = json;
            }).catch(function (e) {
                console.log("There was some sort of error");
                console.log(e);
            });
        })
        next();
    })
    .get(function (req,res){
        var userData = new Diablo_Character_Data(rawUserData);
        var heroMap = userData.CharacterMap();
        var mapIter = heroMap.keys();
        let tempKey;
        let database = firebase.database();
        for (let x of heroMap){
            tempKey = mapIter.next().value;
            database.ref(`username/${req.params.userid}/` + tempKey).set(
                { heroname: heroMap.get(tempKey)
                });
        }
        res.send(`User data has been acquired for : ${req.params.userid}`);
    });

app.route('/characters/last/three')
    .all(function (req,res,next) {
        if (username != undefined) {
            promise = new Promise(function (resolve, reject) {
                var url = 'https://us.api.battle.net/d3/profile/' + username + '/?locale=en_US&apikey=twqr2eysu74xn7ezw9a68tsf3wyub25x';
                fetch(url)
                    .then((res) => {
                        return res.json();
                    }).then((json) => {
                    rawUserData = json;
                }).catch(function (e) {
                    console.log("There was some sort of error");
                    console.log(e);
                });
            })
        }
        else { res.send("no username")}
        next();
    })
    .get(function (req,res){
        if (rawUserData != undefined) {
            var userData = new Diablo_Character_Data(rawUserData);
            var lastThree = userData.LastPlayed();
            var userMap = userData.CharacterMap();
            var names = [];
            console.log(lastThree);
            console.log(userMap)
            lastThree.forEach(x => names.push(userMap.get(x)));
            console.log(names);
            res.send(`${names}`);
        }
        else {res.send("something went wrong")}
    });
app.route('/class/plays')
    .all(function (req,res,next) {
        if (username != undefined) {
            promise = new Promise(function (resolve, reject) {
                var url = 'https://us.api.battle.net/d3/profile/' + username + '/?locale=en_US&apikey=twqr2eysu74xn7ezw9a68tsf3wyub25x';
                fetch(url)
                    .then((res) => {
                        return res.json();
                    }).then((json) => {
                    rawUserData = json;
                }).catch(function (e) {
                    console.log("There was some sort of error");
                    console.log(e);
                });
            })
        }
        else { res.send("no username")}
        next();
    })
    .get(function (req,res){
        if (rawUserData != undefined) {
            var userData = new Diablo_Character_Data(rawUserData);
            var classMostPlayed = userData.MostPlayed();
            res.send(classMostPlayed);
        }
        else {res.send("something went wrong")}
    });

app.route('/user/:userid/update')
    .post(function (req,res) {
        promise = new Promise(function (resolve, reject) {
            username = req.params.userid;
            var url = 'https://us.api.battle.net/d3/profile/' + username + '/?locale=en_US&apikey=twqr2eysu74xn7ezw9a68tsf3wyub25x';
            fetch(url)
                .then((res) => {
                    return res.json();
                }).then((json) => {
                rawUserData = json;
            }).then(function (rawData) {
                var userData = new Diablo_Character_Data(rawUserData);
                var heroMap = userData.CharacterMap();
                var mapIter = heroMap.keys();
                let tempKey;
                let database = firebase.database();
                for (let x of heroMap) {
                    tempKey = mapIter.next().value;
                    database.ref('username/' + tempKey).set(
                        {
                            heroname: heroMap.get(tempKey)
                        });
                }
                res.send("User data has been updated");
            }).catch(function (e) {
                console.log("There was some sort of error");
                console.log(e);
            });
        })
    })

app.route('/character/:characterName')
    .all(function (req,res,next) {
        if (username != undefined) {
            promise = new Promise(function (resolve, reject) {
                hero = req.params.characterName;
                var url = 'https://us.api.battle.net/d3/profile/' + username +"/hero/"+ hero + '?locale=en_US&apikey=twqr2eysu74xn7ezw9a68tsf3wyub25x';
                fetch(url)
                    .then((res) => {
                        return res.json();
                    }).then((json) => {
                    rawHeroData = json;
                }).catch(function (e) {
                    console.log("There was some sort of error");
                    console.log(e);
                });
            })
        }
        next();
    })
    .get(function (req,res){
        if (username == undefined){

            res.send("There is no username yet got to /user/(username) to submit your user name.")
        }
        else {
            console.log(rawHeroData)
            var hero = new HeroData(rawHeroData);
            var heroArray = hero.GeneralInfo();
            var message = "";
            for (let i = 0; i <10; i++){
                message = message + `${heroArray[0][i]}: ${heroArray[1][i]} `;
            }
            res.send(message);
        }
    });
