
import { useDisclosure, Modal, ModalHeader, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button, ModalCloseButton, Input } from "@chakra-ui/react";
import { FormEventHandler, useRef, useState } from "react";

interface props {
    onLogin: Function,
}

export default function Login(props:props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [username, setUsername] = useState<string>("")

    const initialFocusRef = useRef<any>(null);

    function handleLogin(event:any){
        event.preventDefault();
        props.onLogin(username);
    }
  
    return (
      <>
        <Button colorScheme="blue" onClick={onOpen}>Join Game</Button>
  
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            initialFocusRef={initialFocusRef}
            isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleLogin}>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Input required ref={initialFocusRef} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} type="submit">
                Join Game
              </Button>
            </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
    )
  }