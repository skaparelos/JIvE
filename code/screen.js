class Screen {
  constructor(width, height){
    this.width = width
    this.height = height
    this.FPS = 50
    this.period = 1000 / this.FPS // in millisec
    if (width == 0 && height == 0)
      this.get_fullscreen()
  }

  get_fullscreen() {
    this.width = document.body.clientWidth
    this.height = document.body.clientHeight
  }

}
