let startButton=document.querySelector(".start");
let restartButton=document.querySelector(".restart");
let box=document.querySelector(".box");
let canvas=document.querySelector(".board");
let tool=canvas.getContext("2d");
let scoreEle=document.querySelector("span");
let powerLevelEle=document.querySelector(".meter span");

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;

let score=0;
let fullPower=100;
let spaceImg=new Image();
spaceImg.src="Images/space1.jpg";

let earthImg=new Image();
earthImg.src="Images/earth.png";

let coronaImg=new Image();
coronaImg.src="Images/corona.png";

    let eHight=100;
    let eWidth=100;
    let ePosX=canvas.width/2-40;
    let ePosY=canvas.height/2-40;

    let bullets=[];
    let coronas=[];
    let particals=[];   
    class Bullet{
        constructor(x,y,height,width,velocity){
            this.x=x;
            this.y=y;
            this.height=height;
            this.width=width;
            this.velocity=velocity;
        }
        draw(){
    
            tool.fillStyle="white";
            tool.fillRect(this.x,this.y,this.width,this.height);
        }
        update(){
            this.draw();
            this.x=this.x+this.velocity.x;
            this.y=this.y+this.velocity.y;
        }
    }

    class Corona{
        constructor(x,y,height,width,velocity){
            this.x=x;
            this.y=y;
            this.height=height;
            this.width=width;
            this.velocity=velocity;
        }
        draw(){
    
           
            tool.drawImage(coronaImg,this.x,this.y,this.width,this.height);
        }
        update(){
            this.draw();
            this.x=this.x+this.velocity.x;
            this.y=this.y+this.velocity.y;
        }
    }

    class Planet{
        constructor(x,y,height,width){
            this.x=x;
            this.y=y;
            this.height=height;
            this.width=width;
        }
        draw(){
            tool.drawImage(earthImg,this.x,this.y,this.width,this.height);
        }
    }


    class Partical{
        constructor(x,y,radius,velocity){
            this.x=x;
            this.y=y;
            this.radius=radius;
            this.velocity=velocity;
            this.alpha=1;
        }
        draw(){
            tool.save();
            tool.globalAlpha=this.alpha;
            tool.beginPath();
            tool.fillStyle="white";
            tool.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            tool.fill();
            tool.restore();
        }

        update(){
            this.draw();
            this.x=this.x+this.velocity.x;
            this.y=this.y+this.velocity.y;
            this.alpha-=0.01;
        }
    }

    let animId
    function animation(){
    tool.clearRect(0,0,canvas.width,canvas.height);
    tool.fillRect(0,0,canvas.width,canvas.height);
    tool.drawImage(spaceImg,0,0,canvas.width,canvas.height);

    
    let earth=new Planet(ePosX,ePosY,eWidth,eHight);
    earth.draw();
    particals.forEach(function(partical,index){
        if(partical.alpha<=0){
            setTimeout(function(){
                particals.splice(index,1);
            },0);
           
        }else{
   
            partical.update();
        }
       
    })
    //for Bullets
    let bLength=bullets.length;
    for(let i=0;i<bLength;i++){
        bullets[i].update();
        if(bullets[i].x<0||bullets[i].y<0||bullets[i].x>canvas.width||bullets[i].y>canvas.height){
            setTimeout(function(){
                bullets.splice(i,1);    
                
            })
            
        }
    }

    //for Corona
   coronas.forEach(function(corona,i){
        corona.update();
        let enemy=corona;
        if(colRec(earth,enemy)){
            fullPower-=20;
            powerLevelEle.style.width=`${fullPower}%`;
            coronas.splice(i,1);
            if(fullPower==0){
                cancelAnimationFrame(animId);
                //alert("Game Over");
                restart();
            }
           
        }

        bullets.forEach(function(bullet,bulletIndex){
            if(colRec(enemy,bullet)){
                for(let i=0;i<bullet.width*4;i++){
                    particals.push(new Partical(bullet.x,bullet.y,Math.random()*2,{
                        x:(Math.random() - 0.5)*(Math.random()*5),
                        y:(Math.random() - 0.5)*(Math.random()*5)

                    }))
                }
                setTimeout(()=>{
                    coronas.splice(i,1 );
                    bullets.splice(bulletIndex,1);
                    score +=100;
                    scoreEle.innerHTML=score;
                },0
                )
            }

        })
    })
    
    //console.log(bullets);
    animId=requestAnimationFrame(animation);
}

    function createCorona(){
    setInterval(function(){
        let x=Math.random()*canvas.width;
        let y=Math.random()*canvas.height ;
        let delta=Math.random();
        if(delta<0.5){
            x=Math.random()<0.5?0:canvas.width;
            y=Math.random()*canvas.height;
        }else{
            x=Math.random()<0.5?0:canvas.height;
            y=Math.random()*canvas.width;
        }
        let angle=Math.atan2(canvas.height/2-y,canvas.width/2-x);
        let velocity={
            x:Math.cos(angle)*1,
            y:Math.sin(angle)*1
            
        }
        let corona= new Corona(x,y,60,60,velocity);
        coronas.push(corona);
        
    }, 1000)
}

startButton.addEventListener("click",function(e){
    e.stopImmediatePropagation();
    //alert("Start the Game");
    box.style.display="none";
    
    animation();
    createCorona();
    window.addEventListener("click",function(e){
        console.log(e);
        console.log("Mouse clicked");
        let angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
        let velocity={
            x:Math.cos(angle)*7,
            y:Math.sin(angle)*7
        }
        let bullet=new Bullet(canvas.width/2,canvas.height/2,7,7,velocity);
        bullet.draw();
        bullets.push(bullet);
    })
})

function colRec(entity1,entity2){
    let l1=entity1.x;
    let l2=entity2.x;
    let r1=entity1.x+entity1.width;
    let r2=entity2.x+entity2.width;
    let t1=entity1.y+entity1.height;
    let t2=entity2.y+entity2.height;
    let b1=entity1.y;
    let b2=entity2.y;
    if(l1 < r2 && l2 < r1 && t1 > b2 && t2 > b1){
        return true;
    }
    return false;
}

window.addEventListener("resize",function(){
    window.location.reload();
})

function restart(){
    restartButton.style.display="block";
    restartButton.style.display="none";
    box.style.display="flex";
    powerLevelEle.parentElement.style.display="none";
    document.body.style.backgroundColor="white";
    canvas.height="0px";
    restartButton.addEventListener("click",function(){
        window.location.reload();
    })

}

// $(".meter > span").each(function() {
//     $(this)
//       .data("origWidth", $(this).width())
//       .width(0)
//       .animate({
//         width: $(this).data("origWidth") // or + "%" if fluid
//       }, 1200);
//   });
  
