// API key and SteamID64 provided
const apiKey = 'AD2A59088D9710B4817756BA30AD1F0C';
const steamId = '76561198017914494'; // Your SteamID64

// Fetching player summaries (account details)
async function getPlayerSummaries() {
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.response.players[0];
}

// Fetching top played games
async function getTopPlayedGames() {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data.response.games;
}

// Function to display data on the page
async function displaySteamData() {
    const playerSummary = await getPlayerSummaries();
    const games = await getTopPlayedGames();

    // Update Account Information
    document.getElementById('account-name').innerText = playerSummary.personaname;
    document.getElementById('account-creation').innerHTML = `Joined: <span class="highlight">${new Date(playerSummary.timecreated * 1000).toDateString()}</span>`;

    // Calculate total hours played across all games
    const totalHours = games.reduce((acc, game) => acc + game.playtime_forever, 0) / 60;
    document.getElementById('total-playtime').innerHTML = `Total Playtime: <span class="highlight">${totalHours.toFixed(2)}</span> hours`;

    // Update Most Played Game Background and Overlay Text
    const mostPlayedGame = games.sort((a, b) => b.playtime_forever - a.playtime_forever)[0];
    document.getElementById('most-played-game').innerHTML = `
        <img src="https://steamcdn-a.akamaihd.net/steam/apps/${mostPlayedGame.appid}/header.jpg" alt="${mostPlayedGame.name}">
        <div class="most-played-game-overlay">
            <p id="most-played-game-title">${mostPlayedGame.name}</p>
            <p id="most-played-game-hours">${(mostPlayedGame.playtime_forever / 60).toFixed(2)} hrs played</p>
        </div>
    `;

    // Update Top 5 Games
    const topGamesList = document.getElementById('top-games-list');
    const topGames = games.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 5);
    topGames.forEach(game => {
        topGamesList.innerHTML += `
            <li>
                <img src="https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg" alt="${game.name}">
                <span class="game-title">${game.name}</span>
                <span class="game-hours">${(game.playtime_forever / 60).toFixed(2)} hrs</span>
            </li>
        `;
    });
}

// Call the function to display the data
displaySteamData();
