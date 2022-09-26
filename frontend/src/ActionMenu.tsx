import React, {useState} from "react"
import {Button, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverFooter, PopoverHeader, PopoverCloseButton, PopoverArrow, ButtonGroup} from "@chakra-ui/react"

export default function ActionMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    return (
      <>
        <Popover
          returnFocusOnClose={false}
          isOpen={isOpen}
          onClose={close}
          placement="right"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button colorScheme="pink">Target</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              Are you sure you want to continue with your action?
            </PopoverBody>
            <PopoverFooter d="flex" justifyContent="flex-end">
              <ButtonGroup size="sm">
                <Button variant="outline">Cancel</Button>
                <Button colorScheme="red">Apply</Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </>
    )
  }