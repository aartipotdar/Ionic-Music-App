import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild("range", {static: false}) range: IonRange;


  songs = [
    {
      title: "Tera Fitoor",
      subtitle: "Genius",
      img: "/assets/genius.jpg",
      path: "/assets/songs/01 Tera Fitoor (Genius) - Arijit Singh 320Kbps.mp3"
    },
    {
      title: "Photo",
      subtitle: "Luka Chhupi",
      img: "/assets/luka chupi.jpg",
      path: "/assets/songs/03 - Photo (128 Kbps) - DownloadMing.Se.mp3"
    },
    {
      title: "Udi Udi Jaaye",
      subtitle: "Raees",
      img: "/assets/raees.jpg",
      path: "/assets/songs/03 Udi Udi Jaye - Raees (Sukhwinder) 320Kbps.mp3"
    },
    {
      title: "Tera Yaar Hu",
      subtitle: "Sonu ke Titu ki Sweety",
      img: "/assets/sktks.jpg",
      path: "/assets/songs/07 - Tera Yaar Hoon Main - SKTKS (Arijit Singh) 320Kbps.mp3"
    },
    {
      title: "She Don't Know",
      subtitle: "Milind Gaba",
      img: "/assets/she dont know.jpg",
      path: "/assets/songs/She Dont Know Blessed - Millind Gaba (DJJOhAL.Com).mp3"
    }
  ];

  //current song details
  currTitle;
  currSubtitle;
  currImage;

  //progress bar value
  progress = 0;

  //toggle for play/pause button
  isPlaying = false;

  //track of ion-range touch
  isTouched = false;

  //ion range texts
  currSecsText;
  durationText;

  //ion range value
  currRangeTime;
  maxRangeValue;

  //Current song
  currSong: HTMLAudioElement;
  //Upnext song details
  upNextImg;
  upNextTitle;
  upNextSubtitle;

  constructor() {}

  ngOnInit() {
  }

  //play song
  playSong(title, subtitle, img, song) {
     //if a song plays,stop that
    if(this.currSong != null) {
      this.currSong.pause();
    }

    //open full player view
    document.getElementById("fullPlayer").style.bottom ="0px";
    //set current song details
    this.currTitle = title;
    this.currSubtitle = subtitle;
    this.currImage = img;

    //current song audio
    this.currSong = new Audio(song);

    this.currSong.play().then(() => {
      //total song duration
      this.durationText = this.sToTime(this.currSong.duration);
      //set max range value (important to show progress in ion Rnage)
      this.maxRangeValue = Number(this.currSong.duration.toFixed(2).toString().substring(0, 5));

      //set upnext song
      //get current song index
      var index = this.songs.findIndex(x => x.title == this.currTitle);
      //if current song is the last one then first song info for upnext song
      if((index + 1) == this.songs.length) {
        this.upNextImg = this.songs[0].img;
        this.upNextTitle = this.songs[0].title;
        this.upNextSubtitle = this.songs[0].subtitle;
      }

      //else set next song info for upnext song
      else {
        this.upNextImg = this.songs[index + 1].img;
        this.upNextTitle = this.songs[index + 1].title;
        this.upNextSubtitle = this.songs[index + 1].subtitle;
      }

      this.isPlaying = true;
    })

    this.currSong.addEventListener("timeupdate", () => {
      //update some info as song plays on

      //if ion-range not touched then do update
      if(this.isTouched) {
        //update ion-range value
        this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0, 5));
        //update current seconds text
        this.currSecsText = this.sToTime(this.currSong.currentTime);
        //update progress bar (in minnimize view)
        this.progress = (Math.floor(this.currSong.currentTime) / Math.floor(this.currSong.duration));


        //if song ends,play next song
        if(this.currSong.currentTime == this.currSong.duration) {
          this.playNext();
        }
      }
    });
  }

  //convert seconds to seconds format Eg. 57 seconds => 00.57
  sToTime(t) {
    return this.padZero(parseInt(String((t / (60)) % 60))) + ":" +
    this.padZero(parseInt(String((t) % 60)));
  }

  padZero(v) {
    return (v < 10) ? "0" + v : v;
  }

  
  //play next song
  playNext() {
    //get current song index
    var index = this.songs.findIndex(x => x.title == this.currTitle);

    //if current song is last then play first song
    if((index + 1) == this.songs.length) {
      this.playSong(this.songs[0].title, this.songs[0].subtitle, this.songs[0].img, this.songs[0].path);
    }
    //else play next song
    else {
      var nextIndex = index + 1;
      this.playSong(this.songs[nextIndex].title, this.songs[nextIndex].subtitle, this.songs[nextIndex].img, this.songs[nextIndex].path);
    }
  }

  //play previous song
  playPrev() {
    //get current song index
    var index = this.songs.findIndex(x => x.title == this.currTitle);

    //if current song is first one then play last song
    if(index == 0) {
      var lastIndex = this.songs.length - 1;
      this.playSong(this.songs[lastIndex].title, this.songs[lastIndex].subtitle, this.songs[lastIndex].img, this.songs[lastIndex].path);
    }
    //else play previous song
    else {
      var prevIndex = index - 1;
      this.playSong(this.songs[prevIndex].title, this.songs[prevIndex].subtitle, this.songs[prevIndex].img, this.songs[prevIndex].path);
    }
  }

  //minimize full player view
  minimize() {
    document.getElementById("fullPlayer").style.bottom = "-1000px";
    document.getElementById("miniPlayer").style.bottom = "0px";
  }

  //maximize full player view
  maximize() {
    document.getElementById("fullPlayer").style.bottom = "0px";
    document.getElementById("miniPlayer").style.bottom = "-100px";
  }

  //pause current song
  pause() {
    this.currSong.pause();
    this.isPlaying = false;
  }

  //play currently paused song
  play() {
    this.currSong.play();
    this.isPlaying = true;
  }

  //close currently playing song and reset current song info
  cancel() {
    document.getElementById("miniPlayer").style.bottom = "-100px";
    this.currImage = "";
    this.currTitle = "";
    this.currSubtitle = "";
    this.progress = 0;
    this.currSong.pause();
    this.isPlaying = false;
  }

  //on touching ion-range
  touchStart() {
    this.isTouched = true;
    this.currRangeTime = Number(this.range.value);
  }

  //on moving ion-range
  //update current seconds text
  touchMove() {
    this.currSecsText = this.sToTime(this.range.value);
  }

  //on touch released/end
  touchEnd() {
    this.isTouched = false;
    this.currSong.currentTime = Number(this.range.value);
    this.currSecsText = this.sToTime(this.currSong.currentTime)
    this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0, 5));
    if(this.isPlaying) {
      this.currSong.play();
    }
  }
}
