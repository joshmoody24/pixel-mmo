import React, {useRef, useContext, useEffect, useState, createContext, useLayoutEffect} from "react"
import ActionMenu from "./ActionMenu";
import GameContext from "./GameContext";
import Color from "../../../interfaces/Color";
import Position from "../../../interfaces/Position"
import Action from "../../../interfaces/Action"
import { distance } from "../utils"
import { propNames } from "@chakra-ui/react";
import Player from "../../../interfaces/IPlayer"
import {calcStraightLine, hexToRGB} from "../../../utils"

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
    const [targetedPlayer, setTargetedPlayer] = useState<string | undefined>(undefined);

    const squareWidth = (canvasRef.current?.clientWidth ?? 0) / (game.settings?.width ?? 1);
    const spacing = 1.1;

    function handleClick(event:any){
        if(game.settings === null) return;
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
        const targetedPlayerArray = Array.from(game.players.entries()).find(([username, p]) => p.position.x === x && p.position.y === y);
        const targetedPlayer = targetedPlayerArray ? targetedPlayerArray[0] : undefined;
        console.log(targetedPlayerArray)
        const isTargetingPlayer = targetedPlayer !== undefined;
        // what color is the target position?
        const targetColor = game.tilemap?.tiles[x][y];

        const energyCost = calcStraightLine(player!.position, {x,y}).length;
        
        const shoot = {
            name: "Shoot",
            action: () => props.onShoot({x,y}),
            cost: energyCost,
            color: "red",
            disabled: false,
        }
        const move = {
            name: "Move",
            action: () => props.onMove({x,y}),
            cost: energyCost,
            color: "blue",
            disabled: isTargetingPlayer || targetColor !== player?.color,
        }
        const contextMenu = new Array<Action>();
        // is the mouse over a player
        setAvailableActions([move,shoot]);
        setTargetedPlayer(targetedPlayer);
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
        let frameCount:number = 0;
        const render = (time:DOMHighResTimeStamp) => {
            frameCount++
            drawGame(context, time/1000)
            animationFrameId = window.requestAnimationFrame(render)
        }

        render(Date.now()/1000)        

        return () => {
          window.cancelAnimationFrame(animationFrameId)
        }
      }, [drawGame])

    function drawGame(ctx:any, time:number){
        if(game.settings === null) return;
        if(game.tilemap === null || game.tilemap.tiles === null) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,255)';
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        const scale = game.settings.canvasScale;

        // draw the paint
        game.tilemap.tiles.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const color = game.settings!.colors.find(c => c.name === game.tilemap!.tiles[rowIndex][colIndex])
                if(!color) return;
                ctx.fillStyle = color.softHex;
                ctx.fillRect(rowIndex * scale, colIndex * scale, scale, scale);
            });
        })

        // draw gridlines
        ctx.lineWidth="2"
        ctx.strokeStyle = "rgba(150,150,150,.5)";
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
            const color = game.settings!.colors.find(c => c.name === player.color);
            if(!color) return;
            // convert color to numbers we can do math on
            let rgb = hexToRGB(color.strongHex);

            const colorVariation = color.variation;
            const controlledPlayer = player.username === game.username;
            if(controlledPlayer){
                rgb.r *= Math.sin(time*game.settings!.playerAnimationSpeed)*colorVariation+1+colorVariation;
                rgb.g *= Math.sin(time*game.settings!.playerAnimationSpeed)*colorVariation+1+colorVariation;
                rgb.b *= Math.sin(time*game.settings!.playerAnimationSpeed)*colorVariation+1+colorVariation;
            }

            // used to control scaling
            const maxFluctuation = .075;
            const reciprocal = 1/(maxFluctuation);
            ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
            const center: Position = {x:(player.position.x + 0.5) * scale, y:(player.position.y+0.5) * scale}
            const animatedScale = (Math.sin(time*game.settings!.playerAnimationSpeed)/reciprocal+maxFluctuation+1) * scale;
            const finalScale = controlledPlayer ? animatedScale : scale;
            const radius = controlledPlayer ? animatedScale/2 : scale/2;
            ctx.fillRect(center.x - radius, center.y - radius, finalScale, finalScale);
            /*
            ctx.font = "28px arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText(player.username, player.position.x*scale + scale/2, player.position.y*scale + scale/1.5);
            */
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
        if(game.settings === null) return;
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
        document.body.style.backgroundColor = `${color.softHex}44`;
    };

    if(game.settings === null){
        return <>Loading...</>
    }

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
            targetedPlayer={game.players.get(targetedPlayer ?? "")}
            spacing={squareWidth * spacing}
        />
        </>
    )
}