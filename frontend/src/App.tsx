import React, {useState, useEffect, useCallback} from 'react'

// 1. import `ChakraProvider` component
import { Box, Center, ChakraProvider, Stack, Flex, Spacer } from '@chakra-ui/react'
import Nav from "./components/Nav"
import { Grid, GridItem } from '@chakra-ui/react'
import Canvas from "./components/Canvas"
import GameContext from './components/GameContext'
import Player, { defaultPlayer } from '../../interfaces/IPlayer'
import Settings, { defaultSettings } from '../../interfaces/Settings'
import io from "socket.io-client"
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Position from '../../interfaces/Position'

export default function App() {

  const [socket, setSocket] = useState<any>(null);
  const [username, setUsername] = React.useState<string>("");
  const [players, setPlayers] = React.useState(new Map<string, Player>());
  const [settings, setSettings] = React.useState<Settings | null>(null);

  // use usecallback to memoize functions

  const handlePlayerJoined = useCallback((newPlayer:Player) => {
    try{
      setPlayers(players.set(newPlayer.username, newPlayer));
    } catch(err){
      console.error(err);
    }
  },[players]);

  const handleTookDamage = useCallback((data:{attacker:Player,hurtPlayer:Player,amount:number}) => {
    console.log(`${data.hurtPlayer} took ${data.amount} damage`, data.hurtPlayer)
    const newPlayers = new Map(players);
    newPlayers.set(data.hurtPlayer.username, data.hurtPlayer);
    newPlayers.set(data.attacker.username, data.attacker);
    setPlayers(newPlayers);
  },[players])

  const movePlayer = useCallback((destination:Position) => {
    socket.emit('move-player', destination);
  },[socket]);

  const shootAt = useCallback((position:Position) => {
    socket.emit('shoot-location', position);
  },[socket])

  const handleGameInitialization = useCallback((data: {settings:Settings, players:Map<string,Player>, username:string}) => {
    try{
      console.log("Initialized game", data);
      const playerMap = new Map<string, Player>();
      data.players.forEach((player:Player) => {
        if(player) playerMap.set(player.username, player);
      });
      setPlayers(playerMap);
      setSettings(data.settings);
      setUsername(data.username);
    } catch(err:any){
      console.error(err)
    }
  },[]);

  const handleColorChange = useCallback((data: {username:string, color:string}) => {
    players.get(data.username)!.color = settings?.colors.find(c => c.name === data.color)?.name ?? "default";
    setPlayers(players);
  },[players]);

  const handleMove = useCallback((data:Player) => {
    try{
      setPlayers(new Map(players.set(data.username, data)));
    }
    catch(err){
      console.error(err);
    }
  },[players]);

  const handleDisconnect = useCallback((username:string) => {
    console.log(`${username} disconnected`);
    const newPlayers = new Map(players);
    newPlayers.delete(username);
    setPlayers(newPlayers);
  },[players]);

  const handleGainedEnergy = useCallback((username:string) => {
    if(!players.get(username)) return;
    setPlayers(new Map(players.set(username, {...players.get(username)!, energy: players.get(username)!.energy + 1})));
  },[players]);

  // create socket connection
  function createSocketSonnection(username:string) {
    setUsername(username)
    console.log("creating connection to game...")
    const socket = io(`http://${window.location.hostname}:8000?username=${username}`);
    setSocket(socket);
  }

  useEffect(() => {
    const subscribeToEvents = () => {
      if(!socket) return;
      socket.on('initialize-game', handleGameInitialization);
      socket.on('change-color', handleColorChange);
      socket.on('move-player', handleMove);
      socket.on('player-disconnect', handleDisconnect)
      socket.on('player-joined', handlePlayerJoined);
      socket.on('gained-energy', handleGainedEnergy);
      socket.on('took-damage', handleTookDamage);
      return () => {
        socket.close();
      }
    };
    if(username) subscribeToEvents();
  }, [
      socket,
      username,
      handlePlayerJoined,
      handleColorChange,
      handleDisconnect,
      handleGainedEnergy,
      handleGameInitialization
    ]
  );

  const player = players.get(username);

  if(!username){
    return (
      <Center style={{height:"90vh"}}>
        <Login onLogin={(username:string) => {
          createSocketSonnection(username)
        }} />
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
      <Flex p={5} h="90vh" justify={{base:"space-between", lg: "center"}} align={{base:"center", lg:"self-start"}} direction={{base: "column", lg: "row"}}>

        {player && (
          <Sidebar player={player} />
        )}

        <Canvas
          onMove={movePlayer}
          onShoot={shootAt}
        />
        </Flex>

      </GameContext.Provider>
    </ChakraProvider>
  )
}