const express = require("express");
const mineflayer = require("mineflayer");
const bodyParser = require('body-parser')
const inventoryViewer = require('mineflayer-web-inventory')
const autoeat = require('mineflayer-auto-eat').plugin
const app = express();
const port = 1236;
const chats = []
const loginDetails = {
    uname: "iammcacc",          // Username of the Acc
    host: 'play.mcserver.net', // Minecraft Server Name
    v: '1.20.1',                // Minecraft Version You Wanna Join By
    pass: "pass12345"           // Your Minecraft Acc Password
}

// Bot Settings
const bot = mineflayer.createBot({
    host: loginDetails.host,
    username: loginDetails.uname,
    version: loginDetails.v
});

// Load Plugins
bot.loadPlugin(autoeat);

// View Inventory On Browser
inventoryViewer(bot)

// Login To Cracked Server Using a Password
bot.once("login", ()=>{
    chats.push(`Spawned In "login"`);
    console.log(`Spawned In "login"`);
    bot.chat(`/login ${loginDetails.pass}`);
});

// After Successfully Login
bot.once("spawn", ()=>{
    chats.push(`Successfully Spawned In "spawn"`);
    console.log(`Successfully Spawned In "spawn"`);
    setTimeout(() => {
    bot.chat(`/afk`);
    }, 2000);
});

// Show Chats On Terminal
bot.on('chat', (username, message) => {
    if (username === bot.username) return
    chats.push(message)
    console.log(message)
});


app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    res.render("index");
});

app.get("/readChat", (req, res)=>{
    res.render("readChat", {
        chatArr: chats
    });
});

app.get("/sendChat", (req, res)=>{
    res.render("sendChat");
});
app.post("/sendChat", (req, res)=>{
    bot.chat(req.body.getchat);
    bot.chat("/afk");
    res.redirect("/sendChat");
});


// -------------- Auto Eat --------------
bot.on('autoeat_started', (item, offhand) => {
    console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
});
bot.on('autoeat_finished', (item, offhand) => {
    console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
});


// Show Errors
bot.on('autoeat_error', console.error)
bot.on('kicked', console.log);
bot.on('error', console.log);


app.listen(port, ()=>{
    console.log(`APP is Running On http://127.0.0.1:${port}`);
});
