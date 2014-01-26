var data = JSON.parse(decodeURI(location.hash.substring(1)));
document.getElementById('score').innerText = data.points;
document.getElementById('endCondition').innerText = data.endCondition;
document.getElementById('playerInfo').innerText = data.playerType;
