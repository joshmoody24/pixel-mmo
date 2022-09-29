import React from "react"
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Box,
    Flex,
    Container,
  } from '@chakra-ui/react'
import Player from "../../../interfaces/IPlayer"

interface props{
    player: Player
}

export default function Sidebar(props:props){
    return (
        <Box mr={5}>
            <Stat>
                <StatLabel>Energy</StatLabel>
                <StatNumber>{props.player.energy}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Health</StatLabel>
                <StatNumber>{props.player.health}</StatNumber>
            </Stat>
            </Box>
    );
}