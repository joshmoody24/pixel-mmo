import React, {useState} from "react"
import {Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverFooter, PopoverHeader, PopoverCloseButton, PopoverArrow, ButtonGroup} from "@chakra-ui/react"
import Position from '../interfaces/Position'
import Action from "../interfaces/Action"

interface props {
    position: Position,
    isOpen: boolean,
    actions: Action[],
    handleClose: Function,
}

export default function ActionMenu(props:props) {
    return (
      <>
        <Popover
          returnFocusOnClose={false}
          isOpen={props.isOpen}
          //onClose={close}
          placement="right"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button h={0} w={0} p={0} m={0} style={{visibility:"hidden",position:"absolute",left:props.position.x + "px",top:props.position.y + "px"}} colorScheme="pink" />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton onClick={() => props.handleClose()} />
            <PopoverBody>
              Are you sure you want to continue with your action?
            </PopoverBody>
            <PopoverFooter justifyContent="flex-end">
              <ButtonGroup size="sm">
                {props.actions.map(action => (
                    <Button
                        onClick={() => {
                          action.action()
                          props.handleClose()
                        }}
                        key={action.name}
                        colorScheme={action.color}
                        disabled={action.disabled}
                    >
                        {action.name} ({action.cost})
                    </Button>
                ))}
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </>
    )
  }