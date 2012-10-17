   function FrameTimer(framerate,move,draw) {
    var frame_rate=framerate;
    var interval=1000.0/frame_rate;
    var launch_time=new Date();
    var age_in_ticks=0;
    var counter=0;
    var timer=this;
    this.draw=draw;
    this.move=move;

    function timerTick() {
        var ticks=0;
        var now=new Date();
        var age = now-launch_time;
        age_in_ticks= Math.floor(age/interval);

        while (counter<age_in_ticks) {
            counter++;
            ticks++;
			if (timer.move) timer.move();
        }
     
        if (timer.draw) timer.draw();

     
        var time_of_next_frame=(age_in_ticks+1)*interval;
        var time_to_do=time_of_next_frame-age;
        var this_interval=Math.floor(time_to_do);
        setTimeout(timerTick,this_interval);
        }   
    timerTick();
    }
