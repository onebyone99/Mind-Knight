console.log('INIT socket.js');

var socket = io.connect(window.location.origin); //connects to localhost:8080 in this case


socket.on('game_launch', ()=>{
    $('#instructions-container .instructions').html('game launched, awaiting main menu');
});

socket.on('game_menu', ()=>{
    $('#instructions-container .instructions').html('ready for a game');
});

socket.on('game_close', ()=>{
    $('#instructions-container .instructions').html('launch mindnight to begin...');
});

socket.on('game_start', ()=>{
    window.location.replace(window.location.origin + '/game');
});

socket.on('game_inProgress', ()=>{
    $('#instructions-container .instructions').html('A game is already in progress, loading in <span id="countdown">3</span>...');
    var counter = 3;
    var timer = setInterval(()=>{
        if(counter===0) {
            clearInterval(timer);
            window.location.replace(window.location.origin + '/game');
            return;
        }
        counter--;
        $('#countdown').html(counter);
    }, 1000);
});

socket.on('version_expired', (versionData)=>{
    console.log('Your version of MindKnight is out of date. Your version: '+versionData.local+ '  Latest: ' + versionData.current);
    $(document).ready(()=>{
        $('#version').html('v'+versionData.local + ' - (<a href="#" style="color:red;" onclick="update(null)">UPDATE</a>)')
        $('#version').attr('local', versionData.local);
        $('#version').attr('current', versionData.current);
            setTimeout(()=>{
                update(versionData);
            },500);
    });
});

socket.on('version_uptodate', (versionData)=>{
    $(document).ready(()=>{
        $('#version').html('v'+versionData.local + ' - (<a href="#" onclick="update(null)">force update</a>)');
        $('#version').attr('local', versionData.local);
        $('#version').attr('current', versionData.current);
    });
});

socket.on('log', (message)=>{
    console.log('[SERVER LOG]',message); 
});

function simulate(){
    console.log('requesting server simulates');
    socket.emit('simulate', 'test');
}

function test(){
    console.log('requesting server tests');
    socket.emit('test', 'test');
}

function update(versionData){
    if(confirm('Your version of MindKnight is out of date. Would you like to update?' + (versionData==null?'':'\nYour version: '+versionData.local+ '\n Latest: ' + versionData.current))){
        //window.open('https://github.com/Nik-Novak/Mind-Knight#download', '_blank');
        //window.open('https://github.com/Nik-Novak/Mind-Knight/archive/master.zip', '_blank');
        socket.emit('update');
        window.location.replace(window.location.origin + '/update');
    }
}