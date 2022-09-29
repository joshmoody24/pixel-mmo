import React, {useRef, useContext, useEffect, useState, createContext, useLayoutEffect} from "react"
import ActionMenu from "./ActionMenu";
import GameContext from "./GameContext";
import Color from "../../../interfaces/Color";
import Position from "../../../interfaces/Position"
import Action from "../../../interfaces/Action"
import { distance } from "../utils"
import { propNames } from "@chakra-ui/react";
import Player from "../../../interfaces/IPlayer"

interface props {
    onMove: Function,
    onShoot: Function,
}
export default function Canvas(props:props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const game = useContext(GameContext);

    const [displayWidth, setDisplayWidth] = useState(0);
    const [displayHeight, setDisplayHeight] = useState(0);

    const [cursorPos, setCursorPos] = useState<Position>({x:0,y:0})
    const [actionMenuPos, setActionMenuPos] = useState<Position>({x:0,y:0})
    const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
    const [availableActions, setAvailableActions] = useState(new Array<Action>());
    const [targetedPlayer, setTargetedPlayer] = useState<Player | undefined>(undefined);

    const squareWidth = (canvasRef.current?.clientWidth ?? 0) / game.settings.width;
    const spacing = 1.1;
    console.log(squareWidth)

    function handleClick(event:any){
        event.stopPropagation();
        const relativeX = event.nativeEvent.offsetX / canvasRef.current!.clientWidth;
        const relativeY = event.nativeEvent.offsetY / canvasRef.current!.clientHeight;
        const x = Math.floor((relativeX * canvasRef.current!.width)/game.settings.canvasScale);
        const y = Math.floor((relativeY * canvasRef.current!.height)/game.settings.canvasScale);
        setCursorPos({x,y})

        const popoverX = `${Math.floor((event.offsetX + canvasRef.current!.offsetLeft)/squareWidth)*squareWidth}px`
        const popoverY = `${Math.floor((event.offsetY + canvasRef.current!.offsetTop)/squareWidth)*squareWidth}px`
        setShowActionMenu(true);
        setActionMenuPos({x:event.pageX, y:event.pageY})

        // calculate possible actions
        const player = game.players.get(game.username);
        const targetedPlayer = Array.from(game.players.entries()).find(([username, p]) => p.position.x === x && p.position.y === y)
        const isTargetingPlayer = targetedPlayer !== undefined;
        
        const shoot = {
            name: "Shoot",
            action: () => props.onShoot({x,y}),
            cost: Math.ceil(distance(player!.position.x,player!.position.y, x, y)),
            color: "red",
            disabled: !isTargetingPlayer,
        }
        const move = {
            name: "Move",
            action: () => props.onMove({x,y}),
            cost: Math.ceil(distance(player!.position.x,player!.position.y, x, y)),
            color: "blue",
            disabled: isTargetingPlayer,
        }
        const contextMenu = new Array<Action>();
        // is the mouse over a player
        setAvailableActions([move,shoot]);
        setTargetedPlayer(targetedPlayer ? targetedPlayer[1] : undefined);
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', resizeCanvas);    
        // Cleanup function
        // Remove the event listener when the component is unmounted
        return () => {
          window.removeEventListener('resize', resizeCanvas);
        }
      }, []);




    const requestRef = useRef<any>();
    const previousTimeRef = useRef<any>();

    const animate = (time:number) => {
        if(previousTimeRef.current){
            const deltaTime = time - previousTimeRef.current;
        }
        previousTimeRef.current = time;
        //drawGame(canvasRef.current!.getContext('2d'),0)
        requestRef.current = requestAnimationFrame(animate);
    }


    useEffect(() => {
    
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        resizeCanvas(context);        
        let animationFrameId:number;
        const render = () => {
          //frameCount++
          drawGame(context, 0)
          animationFrameId = window.requestAnimationFrame(render)
        }

        render()        

        return () => {
          window.cancelAnimationFrame(animationFrameId)
        }
      }, [drawGame])

    function drawGame(ctx:any, frameCount:number){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(210,255,255,255)';
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        const scale = game.settings.canvasScale;

        // draw gridlines
        ctx.lineWidth="2"
        ctx.strokeStyle = "rgba(100,100,100,.5)";
        for(let x = 0; x < ctx.canvas.width; x+=scale){
            ctx.moveTo(x,0);
            ctx.lineTo(x,ctx.canvas.height);
            ctx.stroke();
        } 
        for(let y = 0; y < ctx.canvas.height; y+=scale){
            ctx.moveTo(0,y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        } 

        // draw each player
        game.players.forEach((player:Player, username:string) => {
            ctx.fillStyle = `${player.color}`;
            ctx.fillRect(player.position.x * scale, player.position.y * scale, scale, scale);
            ctx.font = "32px arial";
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.fillText(player.username, player.position.x*scale + scale/2, player.position.y*scale - scale*3/7);
        });
    
        // draw the cursor
        if(true){
            ctx.lineWidth = "10";
            ctx.strokeStyle = "grey";
            ctx.lineJoin = "round"
            ctx.strokeRect(cursorPos.x * scale, cursorPos.y * scale, scale, scale);
        }
    }
    
    function resizeCanvas(ctx:any){
        const aspect = game.settings.width / game.settings.height;
        if(canvasRef.current!.parentElement!.clientWidth < canvasRef.current!.parentElement!.clientHeight){
            setDisplayWidth(canvasRef.current!.parentElement!.clientWidth);
            setDisplayHeight(canvasRef.current!.parentElement!.clientWidth / aspect);
        }
        else{
            setDisplayHeight(canvasRef.current!.parentElement!.clientHeight);
            setDisplayWidth(canvasRef.current!.parentElement!.clientHeight * aspect);
        }
    }
    
    const setBGColor = (color:Color) => {
        document.body.style.backgroundColor = `${color.hex}44`;
    };

    return (
        <>
        <canvas
            height={game.settings.height * game.settings.canvasScale}
            width={game.settings.width * game.settings.canvasScale}
            ref={canvasRef}
            style={{height:`${displayHeight}px`, width:`${displayWidth}px`}}//, imageRendering: "pixelated"}}
            onClick={handleClick}
        ></canvas>
        <ActionMenu
            position={actionMenuPos}
            isOpen={showActionMenu}
            handleClose={() => setShowActionMenu(false)}
            actions={availableActions}
            targetedPlayer={targetedPlayer}
            spacing={squareWidth * spacing}
        />
        </>
    )
}