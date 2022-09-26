import React, {useState, useEffect} from 'react'

// 1. import `ChakraProvider` component
import { Box, ChakraProvider, flexbox } from '@chakra-ui/react'
import Nav from "./Nav"
import { Grid, GridItem } from '@chakra-ui/react'
import Canvas from "./Canvas"
import GameContext from './GameContext'
import Player, { defaultPlayer } from './interfaces/Player'
import Settings, { defaultSettings } from './interfaces/Settings'
import io from "socket.io-client"

export default function App() {

  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socket = io(`http://${window.location.hostname}:8000?username=testuser`);
    setSocket(socket);

    socket.on('initialize-game', (data: {settings:Settings, players:Map<string,Player>, username:string}) => {
      try{
          console.log("Initialized game", data);
          setPlayers(data.players);
          setSettings(data.settings);
          setUsername(data.username);
          console.log(data.settings);
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
    
    socket.on('move-player', (data: {username:string, position: Position}) => {
      players.get(data.username)!.position = data.position; 
      setPlayers(players);
    });
    
    socket.on('player-disconnect', (username:string) => {
      try{
        console.log(`${username} disconnected`);
        players.delete(username);
        setPlayers(players);
      } catch(err){
        console.error(err);
      }
    })
    
    socket.on('player-joined', (player:Player) => {
      try{
        console.log("Player joined", player)
        players.set(player.username, player);
        setPlayers(players);
      } catch(err){
        console.error(err);
      }
    })
    
    socket.on('gained-energy', (username:string) => {
      try{
        players.get(username)!.energy++;
        setPlayers(players);
      } catch(err){
        console.error(err)
      }
    })


    return () => {
      socket.close();
    }
  }, [setSocket]);

  const [username, setUsername] = React.useState<string>("default");
  const [players, setPlayers] = React.useState(new Map<string, Player>());
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

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
        <GridItem colSpan={2} bg='tomato'>
          Controls go here
        </GridItem>
        <GridItem colSpan={10} bg='papayawhip' style={{display: "flex", alignItems:"center", justifyContent:"center"}}>
          <Canvas />
        </GridItem>
      </Grid>
      </GameContext.Provider>
    </ChakraProvider>
  )
}