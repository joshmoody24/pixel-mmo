import React, {MouseEvent, useState} from "react"
import {Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverFooter, PopoverHeader, PopoverCloseButton, PopoverArrow, ButtonGroup } from "@chakra-ui/react"
import Position from '../../../interfaces/Position'
import Action from "../../../interfaces/Action"
import Player from "../../../interfaces/IPlayer"

interface props {
    position: Position,
    isOpen: boolean,
    actions: Action[],
    handleClose: Function,
    targetedPlayer?: Player,
    spacing?: number,
    onAct: Function,
}

export default function ActionMenu(props:props) {

  const spacing = props.spacing ?? 50;

    const enemyInfo = (
      <>
      Health: {props.targetedPlayer?.health}
      <br />
      Energy: {props.targetedPlayer?.energy}
      </>
    );

    return (
      <>
        <Popover
          returnFocusOnClose={false}
          isOpen={props.isOpen}
          //onClose={close}
          placement="top"
          offset={[0,spacing]}
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <div h={0} w={0} p={0} m={0} style={{visibility:"hidden",position:"absolute",left:props.position.x + "px",top:props.position.y + "px"}} />
          </PopoverTrigger>
          <PopoverContent style={{backgroundColor:"#fff3", backdropFilter:"blur(5px)",width:"auto"}}>
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">{props.targetedPlayer ? `Enemy: ${props.targetedPlayer.username}` : "Actions"}</PopoverHeader>
            <PopoverCloseButton onClick={() => props.handleClose()} />
            <PopoverBody>
              {props.targetedPlayer ? enemyInfo : "Select an action"}
            </PopoverBody>
            <PopoverFooter justifyContent="flex-end">
              <ButtonGroup>
                {props.actions.map(action => (
                    <Button
                        onClick={() => {
                          action.action()
                          //props.handleClose()
                        }}
                        key={action.name}
                        colorScheme={action.color}
                        disabled={action.disabled}
                        style={{pointerEvents:"auto"}}
                    >
                        {action.name} ({Math.round(action.cost)})
                    </Button>
                ))}
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </>
    )
  }