document.addEventListener("DOMContentLoaded",()=>{
    const grid=document.querySelector(".grid")
    const doodler=document.createElement("div")
    const isGameOver=false
    const platformCount=5
    let platforms=[]
    let startPoint=150
    let doodleLeftSpace=50
    let doodlerBottomSpace=startPoint
    let upTimerId
    let downTimerId
    let isJumping=true
    let isGoingLeft=false
    let isGoingRight=false
    let leftTimeId
    let rightTimeId
    let score=0

    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodler.style.left=doodleLeftSpace+'px';
        doodler.style.bottom=doodlerBottomSpace+'px';
    }

    class Platform{
        constructor(newPlatBottom){
            this.bottom=newPlatBottom
            this.left=Math.random()*315
            this.visual=document.createElement("div") 

            const visual=this.visual
            visual.classList.add('platform')
            visual.style.left=this.left+'px'
            visual.style.bottom=this.bottom+'px'
            grid.appendChild(visual) 
        }
    }
    function createPlatforms(){
        for(let i=0;i<platformCount;i++){
            let platGap=600/platformCount
            let newPlatBottom=100+i*platGap
            let newPlatForm=new Platform(newPlatBottom)
            platforms.push(newPlatForm)
            console.log(platforms)
        }

    }

    function movePlatforms(){ 
        if(doodlerBottomSpace>200){
            platforms.forEach(platform=>{
                platform.bottom-=4
                let visual=platform.visual
                visual.style.bottom=platform.bottom+'px'

                if(platform.bottom<10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift() 
                    score++
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }
    function jump(){
        clearInterval(downTimerId)
        isJumping=true
        upTimerId = setInterval(function(){
            doodlerBottomSpace+=20
            doodler.style.bottom = doodlerBottomSpace+'px'
            if (doodlerBottomSpace>=startPoint+200){
                fall()
            }
        },30)
    }
    function fall(){
        clearInterval(upTimerId)
        isJumping=false
        downTimerId = setInterval(function(){
            doodlerBottomSpace-=5
            doodler.style.bottom=doodlerBottomSpace+'px'
            if (doodlerBottomSpace<=0){
                gameOver()
            }
            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace>=platform.bottom) &&
                    (doodlerBottomSpace<=platform.bottom+15) &&
                    ((doodleLeftSpace+60)>=platform.left) &&
                    (doodleLeftSpace<=(platform.left+85)) &&
                    !isJumping
                ){
                    startPoint=doodlerBottomSpace
                    jump()
                }
            })
        },30)
    }

    function gameOver(){

        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML=score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimeId)
        clearInterval(rightTimeId)
    }

    function control(e){
        if (e.key==='ArrowLeft'){
            moveLeft()
        }else if(e.key==='ArrowRight'){
            moveRight()
        }else if(e.key==='ArrowUp'){
            moveStraight()
        }else if(e.key==='ArrowDown'){
            //move down
        }else{
            //default
        }
    }

    function moveLeft(){
        if (isGoingRight){
            clearInterval(rightTimeId)
            isGoingRight=false
        }
        isGoingLeft=true
        leftTimeId = setInterval(function(){
            if(doodleLeftSpace>=0){
                doodleLeftSpace -=5
                doodler.style.left=doodleLeftSpace+'px'
            }else moveRight()
        },30)
    
    }

    function moveRight(){
        if (isGoingLeft){
            clearInterval(leftTimeId)
            isGoingLeft=false
        }
        isGoingRight=true
        rightTimeId = setInterval(function(){
            if (doodleLeftSpace<=340){
                doodleLeftSpace+=5
                doodler.style.left=doodleLeftSpace+'px '
            }else moveLeft()
        },30)
    }

    function moveStraight(){
        isGoingLeft=false
        isGoingRight=false
        clearInterval(rightTimeId)
        clearInterval(leftTimeId)

    }

    function start(){
        if(!isGameOver){
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup',control)
        }
    }
    start()
})
