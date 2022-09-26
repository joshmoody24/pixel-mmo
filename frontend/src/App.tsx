import * as React from 'react'

// 1. import `ChakraProvider` component
import { Box, ChakraProvider, flexbox } from '@chakra-ui/react'
import Nav from "./Nav"
import { Grid, GridItem } from '@chakra-ui/react'
import Canvas from "./Canvas"
import GameContext from './GameContext'
import Player, { defaultPlayer } from './interfaces/Player'
import Settings, { defaultSettings } from './interfaces/Settings'

export default function App() {

  const [player, setPlayer] = React.useState<Player>(defaultPlayer);
  const [players, setPlayers] = React.useState(new Array<Player>());
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

  return (
    <ChakraProvider>
    <GameContext.Provider value={{
      player,
      players,
      settings,
      cursor:{x:0,y:0,active:false},
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