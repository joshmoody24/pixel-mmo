import React, {useState, useEffect} from 'react'

// 1. import `ChakraProvider` component
import { Box, Center, ChakraProvider, flexbox } from '@chakra-ui/react'
import Nav from "./components/Nav"
import { Grid, GridItem } from '@chakra-ui/react'
import Canvas from "./components/Canvas"
import GameContext from './components/GameContext'
import Player, { defaultPlayer } from './interfaces/Player'
import Settings, { defaultSettings } from './interfaces/Settings'
import io from "socket.io-client"
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Position from './interfaces/Position'

export default function App() {

  const [socket, setSocket] = useState<any>(null);
  const [username, setUsername] = React.useState<string>("default");
  const [players, setPlayers2] = React.useState(new Map<string, Player>());
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

  function setPlayers(test:any){
    console.log("SETTING PLAYERS: ",test.length);
    console.trace();
    setPlayers2(test);
  }

  const createSocketConnection = (username:string) => {
    console.log("creating connection to game...")
    const socket = io(`http://${window.location.hostname}:8000?username=${username}`);
    setSocket(socket);

    socket.on('initialize-game', (data: {settings:Settings, players:Map<string,Player>, username:string}) => {
      try{
          console.log("Initialized game", data);
          const playerMap = new Map<string, Player>();
          data.players.forEach(p => playerMap.set(p.username, p));
          setPlayers(playerMap);
          setSettings(data.settings);
          setUsername(data.username);
          //resizeCanvas(ctx);
          //setBGColor(window.game.player.color);
          //drawGame(ctx);
  
      } catch(e){
          console.error(e);
      }
    });

    socket.on('change-color', (data: {username:string, color:string}) => {
      players.get(data.username)!.color = settings.colors.get(data.color) ?? "default";
       setPlayers(players);
    });
    
    socket.on('move-player', (data: Player) => {
      setPlayers(new Map(players.set(data.username, data)));
    });
    
    socket.on('player-disconnect', (username:string) => {
      try{
        console.log(`${username} disconnected`);
        const newPlayers = new Map(players);
        newPlayers.delete(username);
        setPlayers(newPlayers);
      } catch(err){
        console.error(err);
      }
    })
    
    socket.on('player-joined', (newPlayer:Player) => {
      try{
        console.log("Player joined", newPlayer)
        setPlayers(new Map(players.set(newPlayer.username, newPlayer)));
      } catch(err){
        console.error(err);
      }
    })
    
    socket.on('gained-energy', (username:string) => {
      try{
        if(!players.get(username)) return;
        setPlayers(new Map(players.set(username, {...players.get(username)!, energy: players.get(username)!.energy + 1})));
      } catch(err){
        console.error(err)
      }
    })

    /*
    return () => {
      socket.close();
    }
    */
  };


  console.log(players);


  function handleMove(destination:Position) {
    socket.emit('move-player', destination);
  }

  console.log(typeof players.get);
  const player = players.get(username);

  if(username==="default"){
    return (
      <Center style={{height:"90vh"}}>
        <Login onLogin={createSocketConnection} />
      </Center>
    )
  }

  return (
    <ChakraProvider>
    <GameContext.Provider value={{
      username,
      players,
      settings,
      cursor:{x:0,y:0,active:false},
      socket,
    }}>

      <Nav />
      <Grid
        minHeight="90vh"
        templateRows='1fr'
        templateColumns='repeat(12, 1fr)'
        gap={4}
      >
        <GridItem colSpan={2}>
          {player && (
            <Sidebar player={player} />
          )}
        </GridItem>
        <GridItem colSpan={10} style={{display: "flex", alignItems:"center", justifyContent:"center"}}>


          <Canvas
            onMove={handleMove}
            onShoot={handleMove}
          />


        </GridItem>
      </Grid>
      </GameContext.Provider>
    </ChakraProvider>
  )
}