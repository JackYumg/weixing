export class TileLayer {
  name: string = ''
  url: string = ''

  load() {
    fetch(this.url).then(res => {
      console.log(res)
    })
  }
}
