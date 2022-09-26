import React, {useRef, useContext, useEffect, useState} from "react"
import GameContext from "./GameContext";
import Color from "./interfaces/Color";

export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const game = useContext(GameContext);

    const [displayWidth, setDisplayWidth] = useState(0);
    const [displayHeight, setDisplayHeight] = useState(0);

    useEffect(() => {
        window.addEventListener('resize', resizeCanvas);
    
        // Cleanup function
        // Remove the event listener when the component is unmounted
        return () => {
          window.removeEventListener('resize', resizeCanvas);
        }
      }, []);

    useEffect(() => {
    
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        let frameCount = 0
        let animationFrameId : number

        resizeCanvas(context);
        
        //Our draw came here
        const render = () => {
          frameCount++
          drawGame(context, frameCount)
          animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
          window.cancelAnimationFrame(animationFrameId)
        }
      }, [drawGame])

    function drawGame(ctx:any, frameCount:number){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'rgba(210,255,255,255)';
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        const scale = game.settings.canvasScale;
        // start with white square
        // draw each player
        game.players.forEach(player => {
            ctx.fillStyle = `${player.color}`;
            ctx.fillRect(player.position.x * scale, player.position.y * scale, scale, scale);
            ctx.font = "32px arial";
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.fillText(player.username, player.position.x*scale + scale/2, player.position.y*scale - scale*3/7);
        });
    
        // draw the cursor
        const cursor = game.cursor;
        if(cursor){
            ctx.lineWidth = "10";
            ctx.strokeStyle = "grey";
            ctx.lineJoin = "round"
            ctx.strokeRect(cursor.x * scale, cursor.y * scale, scale, scale);
        }
    }
    
    function resizeCanvas(ctx:any){
        console.log(game)
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
        <canvas
            height={game.settings.height * game.settings.canvasScale}
            width={game.settings.width * game.settings.canvasScale}
            ref={canvasRef}
            style={{height:`${displayHeight}px`, width:`${displayWidth}px`}}
        ></canvas>
    )
}