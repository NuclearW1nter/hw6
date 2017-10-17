
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
    NextClass()
    {
        var availableClasses = ["barbarian","crusader","demon-hunter","monk","necromancer","witch-doctor","wizard"];
        var classPlaytime = [0,0,0,0,0,0,0];
        var season0PlayTime = [];

        var iteration;
        for (let iter in this.D3_data["seasonalProfiles"]) {
            iteration = 0;
            for (let i in this.D3_data["seasonalProfiles"][iter]["timePlayed"]) {
                if (iter == "season0"){
                    season0PlayTime.push(this.D3_data["seasonalProfiles"][iter]["timePlayed"][i]);
                }
                else{
                    classPlaytime[iteration] = classPlaytime[iteration] + this.D3_data["seasonalProfiles"][iter]["timePlayed"][i];
                    iteration++;
                }

            }

        }

        var lastTime = [];
        var playMap =  new Map();
        var lastThree;
        var tempid;
        for (let iter in this.D3_heroes){
            for(let iterator in this.D3_heroes[iter]){
                if (iterator === "class"){
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
        notLastThree.forEach(x => playMap.delete(x));
        var lastPlayed = [];
        for (let i of playMap){
            lastPlayed.push(i[1]);
        }
        var currentClass = lastPlayed[0];
        var twoFound = false;
        var threeFound = false;
        if(currentClass == lastPlayed[1] && currentClass == lastPlayed[2]){
            threeFound = true;
        }
        else if( currentClass == lastPlayed[1] || currentClass == lastPlayed[2]){
            twoFound = true;
        }
        else if ( lastPlayed[1] == lastPlayed[2]){
            currentClass == lastPlayed[1];
        }
        if (threeFound == true || twoFound == true){
            let indexOfplayedClass = availableClasses.indexOf(currentClass);
            classPlaytime[indexOfplayedClass] = classPlaytime[indexOfplayedClass] + 100;
        }
        var currentTop = 0;
        for (let x = 1; x < 7; x++){
            if (classPlaytime[currentTop] > classPlaytime[x]){
                currentTop = x;
            }
        }
        var classToPlay = availableClasses[currentTop];
        return classToPlay;
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
    Followers(){
        var followers_used = []
        for (let i in this.characterData["followers"]){
            if(Object.keys(this.characterData["followers"][i]["items"]).length != 0){
                followers_used.push(i);
            }
        }
        return followers_used;
    }
    ItemsAndSkill(){
        var items = [];
        var skillsActive = [];
        var skillsPassive = [];
        for (let iter in this.characterData["items"]){
            for (let i in this.characterData['items'][iter]){
                if (i == 'name'){
                    items.push(this.characterData['items'][iter][i]);
                }
            }
        }
        for (let i in this.characterData['skills']){
            if (i == 'active'){
                for (let iter in this.characterData['skills'][i]){
                    for(let iterator in this.characterData['skills'][i][iter]){
                        if (iterator == 'skill'){
                            skillsActive.push(this.characterData['skills'][i][iter][iterator]['name']);
                        }
                    }
                }
            }
            if (i == 'passive'){
                for (let iter in this.characterData['skills'][i]){
                    for(let iterator in this.characterData['skills'][i][iter]){
                        skillsPassive.push(this.characterData['skills'][i][iter][iterator]['name']);
                    }
                }
            }
        }
        var returnArray = []
        returnArray.push(items);
        returnArray.push(skillsActive);
        returnArray.push(skillsPassive);
        return returnArray;

    }
}

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const firebase = require("firebase");
var errorFound;
var rawUserData;
var rawHeroData;
var username;
var nextClassToPlay;
var itmsAndskill = [];
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
app.get('/class/next',function (req,res) {
    res.send(`The next class you should play is ${nextClassToPlay}.`)
});
app.get('/playstyle',function (req,res) {
    res.send("Type choose from fighter, tank, ranged and add it onto /playstyle ie. /playstyle/fighter");
})
app.get('/playstyle/:style', function (req, res) {
    if (req.params.style == "fighter"){
        res.send("You should try working with the Enchantress")
    }
    else if (req.req.params.style == "tank"){
        res.send("You should try working with the Scoundrel")
    }
    else if (req.req.params.style == "ranged"){
        res.send("You should try working with the Templar")
    }
});
app.route('/user/:userid')
    .all(function (req,res,next) {
        promise = new Promise(function (resolve,reject) {
            username = req.params.userid;
            errorFound = 0;
            var url = 'https://us.api.battle.net/d3/profile/' + username + '/?locale=en_US&apikey=twqr2eysu74xn7ezw9a68tsf3wyub25x';
            fetch(url)
                .then((res) =>{
                    return res.json();
                }).then((json) => {
                rawUserData = json;
            }).then((data) => {
                if (errorFound === 1){
                    res.send('You have entered an invalid username.')
                }
                var userData = new Diablo_Character_Data(rawUserData);
                var heroMap = userData.CharacterMap();
                var mapIter = heroMap.keys();
                var heroData;
                var characterId = [];
                var heroInfo = [];
                nextClassToPlay = userData.NextClass();
                var itemPlaces = ['rightFinger', 'leftFinger', 'neck','offHand','waist','mainHand','torso','feet','hands','shoulders','legs','bracers','head'];
                let tempKey;
                let database = firebase.database();
                for (let x of heroMap){
                    tempKey = mapIter.next().value;
                    characterId.push(tempKey);
                    database.ref(`username/${req.params.userid}/` + tempKey).set(
                        { heroname: heroMap.get(tempKey)
                        });
                }
                for (let names of characterId){
                    promise = new Promise(function (resolve, reject) {
                        var url = 'https://us.api.battle.net/d3/profile/' + username +"/hero/"+ names + '?locale=en_US&apikey=twqr2eysu74xn7ezw9a68tsf3wyub25x';
                        fetch(url)
                            .then((res) => {
                                return res.json();
                            }).then((json) => {
                            rawHeroData = json;
                            heroData = new HeroData(rawHeroData);
                            heroInfo = heroData.GeneralInfo();
                            itmsAndskill = heroData.ItemsAndSkill();
                            for (let i = 0; i < itmsAndskill[0].length;i++){
                                database.ref(`username/${req.params.userid}/${names}/items/`+ itemPlaces[i]).set(
                                    { item : itmsAndskill[0][i]
                                    });
                            }
                            let skillSet = ['skill1','skill2','skill3','skill4','skill5','skill6']
                            for (let i = 0; i < itmsAndskill[1].length;i++){
                                database.ref(`username/${req.params.userid}/${names}/Active Skills/` +skillSet[i] ).set(
                                    { skill : itmsAndskill[1][i]
                                    });
                            }
                            for (let i = 0; i < itmsAndskill[2].length;i++){
                                database.ref(`username/${req.params.userid}/${names}/Passive Skills/`+ skillSet[i]).set(
                                    { skill : itmsAndskill[2][i]
                                    });
                            }
                            for (let i = 0; i <10; i++){
                                database.ref(`username/${req.params.userid}/${names}/General Info/`+ heroInfo[0][i]).set(
                                    { Info : heroInfo[1][i]
                                    });
                            }
                            followerData = heroData.Followers();
                            for (let x of followerData){
                                database.ref(`username/${req.params.userid}/${names}/Followers/`).set({
                                    Follower : x
                                });
                            }
                        }).catch(function (e) {
                            console.log("There was some sort of error");
                            console.log(e);
                        });
                    })

                }
            }).catch(function (e) {
                console.log("There was some sort of error");
                console.log(e);
                res.send("You have entered in the wrong user name.");
            });
        })
        next();
    })
    .get(function (req,res){
        res.send(`User data has been acquired for : ${req.params.userid}`);
    });
var keys;
var storedData;
app.get('/itemset/:characterid',function (req,res){
    var itemSet = [];
    var skillSet = [];
    var itemName = [];
    var passive = [];
    let database = firebase.database();
    var ref = database.ref(`username/${username}/${req.params.characterid}`);
    ref.on('value',gotData, errData);
    for (let i in storedData){
        if (i == "items"){
            for (let iter in storedData[i]){
                itemName.push(iter);
                itemSet.push(storedData[i][iter]['item']);
            }
        }
        if (i == "Active Skills"){
            for (let iter in storedData[i]){
                skillSet.push(storedData[i][iter]['skill']);
            }
        }
        if (i == "Passive Skills"){
            for (let iter in storedData[i]){
                passive.push(storedData[i][iter]['skill']);
            }
        }
    }
    var msg = "Your items are: ";
    for (let i = 0; i <itemSet.length; i++){
        msg += ` ${itemName[i]} -> ${itemSet[i]}`;
    }
    if (skillSet == undefined || passive == undefined || skillSet == null){
        res.send("try refreshing the page")
    }
    else {
        msg += ` and your active skills are ${skillSet.toString()} and your passive skills are ${passive.toString()}`;
        res.send(msg);
    }
})
function gotData(data) {
    storedData = data.val();
    keys = Object.keys(storedData);
}
function errData(err) {
    console.log('Error has occurred')
}
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
